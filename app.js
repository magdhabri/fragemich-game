const splashScreen = document.getElementById("splash-screen");
		const menuScreen = document.getElementById("menu-screen");
		const questionsModeScreen = document.getElementById("questions-mode-screen");
		const boardScreen = document.getElementById("board-screen");
		const winScreen = document.getElementById("win-screen");
		const startButton = document.getElementById("start-button");
		const backToMenuButton = document.getElementById("back-to-menu");
		const showBoardButton = document.getElementById("show-board-button");
		const boardBackButton = document.getElementById("board-back-button");
		const hexCells = Array.from(document.querySelectorAll(".hex-cell"));
		const questionTextEl = document.getElementById("question-text");
		const questionBadgeEl = document.getElementById("question-badge");
		const answerLineEl = document.getElementById("answer-line");
		const newQuestionButton = document.getElementById("new-question-button");
		const showAnswerButton = document.getElementById("show-answer-button");
		const team1Btn = document.getElementById("team-1-btn");
		const team2Btn = document.getElementById("team-2-btn");
		const team1MinusIcon = document.getElementById("team-1-minus-icon");
		const team2MinusIcon = document.getElementById("team-2-minus-icon");
		const team1BlockIcon = document.getElementById("team-1-block-icon");
		const team2BlockIcon = document.getElementById("team-2-block-icon");
		const team1AuctionIcon = document.getElementById("team-1-auction-icon");
		const team2AuctionIcon = document.getElementById("team-2-auction-icon");
		const countdownOverlay = document.getElementById("countdown-overlay");
		const countdownTextEl = document.getElementById("countdown-text");
		const countdownNumberEl = document.getElementById("countdown-number");
		const minusPopupOverlay = document.getElementById("minus-popup-overlay");
		const minusPopupQuestionEl = document.getElementById("minus-popup-question");
		const minusPopupAnswerEl = document.getElementById("minus-popup-answer");
		const minusPopupShowAnswerBtn = document.getElementById("minus-popup-show-answer");
		const minusPopupCorrectBtn = document.getElementById("minus-popup-correct");
		const minusPopupWrongBtn = document.getElementById("minus-popup-wrong");
		const auctionPopupOverlay = document.getElementById("auction-popup-overlay");
		const auctionPopupQuestionEl = document.getElementById("auction-popup-question");
		const auctionPopupTimerEl = document.getElementById("auction-popup-timer");
		const auctionPopupStartWrap = document.getElementById("auction-popup-start-wrap");
		const auctionPopupResultActions = document.getElementById("auction-popup-result-actions");
		const auctionPopupCloseBtn = document.getElementById("auction-popup-close");
		const auctionPopupAnotherBtn = document.getElementById("auction-popup-another");
		const auctionPopupStartBtn = document.getElementById("auction-popup-start");
		const auctionPopupSuccessBtn = document.getElementById("auction-popup-success");
		const auctionPopupFailBtn = document.getElementById("auction-popup-fail");
		const roundTitleRedEl = document.querySelector(".round-title .line-red");
		const team1ScoreEl = team1Btn.querySelector(".score-pill");
		const team2ScoreEl = team2Btn.querySelector(".score-pill");
		const rootStyle = document.documentElement.style;
		let countdownTimer = null;
		let auctionTimer = null;
		let auctionTeamClass = "";
		let auctionCardEl = null;
		let minusTargetClass = "";
		let minusSelfClass = "";
		let usedMinusQuestionKeys = new Set();
		let usedAuctionQuestions = new Set();
		let usedMainQuestionKeys = new Set();

		function updateResponsiveMetrics() {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const scale = Math.max(0.72, Math.min(1, Math.min(width / 1280, height / 900)));
			rootStyle.setProperty("--ui-scale", scale.toFixed(3));
			rootStyle.setProperty("--app-height", `${height}px`);
		}

let selectedLetter = "";
		let currentQuestion = null;
		let currentPool = [];
		let currentRound = 1;
		let team1RoundsWon = 0;
		let team2RoundsWon = 0;

		// Nachbarschafts-Mapping fÃ¼r Hex-Board
		const NEIGHBORS = {
			0: [1, 5, 6], 1: [0, 2, 5, 6, 7], 2: [1, 3, 6, 7, 8], 3: [2, 4, 7, 8, 9], 4: [3, 8, 9],
			5: [0, 1, 6, 10, 11], 6: [0, 1, 2, 5, 7, 10, 11, 12], 7: [1, 2, 3, 6, 8, 11, 12, 13], 8: [2, 3, 4, 7, 9, 12, 13, 14], 9: [3, 4, 8, 13, 14],
			10: [5, 6, 11, 15, 16], 11: [5, 6, 7, 10, 12, 15, 16, 17], 12: [6, 7, 8, 11, 13, 16, 17, 18], 13: [7, 8, 9, 12, 14, 17, 18, 19], 14: [8, 9, 13, 18, 19],
			15: [10, 11, 16, 20, 21], 16: [10, 11, 12, 15, 17, 20, 21, 22], 17: [11, 12, 13, 16, 18, 21, 22, 23], 18: [12, 13, 14, 17, 19, 22, 23, 24], 19: [13, 14, 18, 23, 24],
			20: [15, 16, 21], 21: [15, 16, 17, 20, 22], 22: [16, 17, 18, 21, 23], 23: [17, 18, 19, 22, 24], 24: [18, 19, 23]
		};

		function getRowIndex(cellIndex) {
			return Math.floor(cellIndex / 5);
		}

		function hasWinningPath(className) {
			// UNUSED: Team 1 uses hasWinningPathVertical instead
			return false;
		}

		function getColumnIndex(cellIndex) {
			return cellIndex % 5;
		}

		function hasWinningPathVertical(className) {
			// Team 1: Pfad von oberste Reihe (0-4) zu unterste Reihe (20-24)
			const firstRowCells = [0, 1, 2, 3, 4];
			for (let startIdx of firstRowCells) {
				if (hexCells[startIdx].classList.contains(className)) {
					if (hasPathToBottomVertical(startIdx, className, new Set())) {
						return true;
					}
				}
			}
			return false;
		}

		function hasPathToBottomVertical(cellIndex, className, visited) {
			const rowIndex = getRowIndex(cellIndex);
	
			if (!hexCells[cellIndex].classList.contains(className)) return false;
			if (visited.has(cellIndex)) return false;
	
			visited.add(cellIndex);
	
			// Erreichte unterste Reihe?
			if (rowIndex === 4) return true;
	
			// PrÃ¼fe Nachbarn in tieferen Reihen
			const neighbors = NEIGHBORS[cellIndex] || [];
			for (let neighborIdx of neighbors) {
				if (getRowIndex(neighborIdx) > rowIndex) {
					if (hasPathToBottomVertical(neighborIdx, className, visited)) {
						return true;
					}
				}
			}
	
			return false;
		}

		function hasWinningPathHorizontal(className) {
			// Team 2: Pfad von linker Spalte (0,5,10,15,20) zu rechter Spalte (4,9,14,19,24)
			const leftColumnCells = [0, 5, 10, 15, 20];
			for (let startIdx of leftColumnCells) {
				if (hexCells[startIdx].classList.contains(className)) {
					if (hasPathToRightHorizontal(startIdx, className, new Set())) {
						return true;
					}
				}
			}
			return false;
		}

		function hasPathToRightHorizontal(cellIndex, className, visited) {
			const colIndex = getColumnIndex(cellIndex);
	
			if (!hexCells[cellIndex].classList.contains(className)) return false;
			if (visited.has(cellIndex)) return false;
	
			visited.add(cellIndex);
	
			// Erreichte rechte Spalte?
			if (colIndex === 4) return true;
	
			// PrÃ¼fe Nachbarn in rechteren Spalten
			const neighbors = NEIGHBORS[cellIndex] || [];
			for (let neighborIdx of neighbors) {
				if (getColumnIndex(neighborIdx) > colIndex) {
					if (hasPathToRightHorizontal(neighborIdx, className, visited)) {
						return true;
					}
				}
			}
	
			return false;
		}

		function showScreen(activeScreen) {
			[splashScreen, menuScreen, questionsModeScreen, boardScreen, winScreen].forEach((screen) => {
				screen.classList.add("hidden");
				screen.setAttribute("aria-hidden", "true");
			});
			activeScreen.classList.remove("hidden");
			activeScreen.setAttribute("aria-hidden", "false");
		}

		function openMenuScreen() {
			showScreen(menuScreen);
		}

		function openQuestionsModeScreen() {
			showScreen(questionsModeScreen);
		}

		function openBoardScreen() {
			showScreen(boardScreen);
		}

		function getRoundLabel(roundNumber) {
			if (roundNumber === 1) return "Erste";
			if (roundNumber === 2) return "Zweite";
			if (roundNumber === 3) return "Dritte";
			return `${roundNumber}.`;
		}

		function updateRoundUI() {
			roundTitleRedEl.textContent = getRoundLabel(currentRound);
			team1ScoreEl.textContent = String(team1RoundsWon);
			team2ScoreEl.textContent = String(team2RoundsWon);
		}

		function resetBoard() {
			// Entferne alle Farb- und Aktiv-Klassen von allen Zellen
			hexCells.forEach((cell) => {
				cell.classList.remove("active", "active-green", "active-orange");
			});
			selectedLetter = "";
			currentQuestion = null;
			currentPool = [];
			questionBadgeEl.textContent = "!";
			questionTextEl.textContent = "Wähle einen Buchstaben, um eine Frage anzuzeigen.";
			hideAnswer();
		}

		function resetMatch() {
			currentRound = 1;
			team1RoundsWon = 0;
			team2RoundsWon = 0;
			usedMinusQuestionKeys = new Set();
			usedAuctionQuestions = new Set();
			usedMainQuestionKeys = new Set();
			resetTeamCards();
			updateRoundUI();
			resetBoard();
		}

		function getQuestionKey(entry) {
			return `${entry.question}|||${entry.answer}`;
		}

		function markCardUsed(cardEl) {
			if (!cardEl || cardEl.dataset.used === "true") {
				return false;
			}
			cardEl.dataset.used = "true";
			cardEl.style.visibility = "hidden";
			cardEl.style.pointerEvents = "none";
			return true;
		}

		function resetCard(cardEl) {
			if (!cardEl) return;
			cardEl.dataset.used = "false";
			cardEl.style.visibility = "visible";
			cardEl.style.pointerEvents = "auto";
		}

		function resetTeamCards() {
			resetCard(team1BlockIcon);
			resetCard(team2BlockIcon);
			resetCard(team1MinusIcon);
			resetCard(team2MinusIcon);
			resetCard(team1AuctionIcon);
			resetCard(team2AuctionIcon);
		}

		function showWinScreen(teamName, teamColor) {
			const winTeamNameEl = document.getElementById("win-team-name");
			const winMessageEl = document.getElementById("win-message");
			const nextRoundBtn = document.getElementById("next-round-button");
			const isTeam1 = teamName === "Team 1";

			if (isTeam1) {
				team1RoundsWon += 1;
			} else {
				team2RoundsWon += 1;
			}

			updateRoundUI();

			const winnerRoundsWon = isTeam1 ? team1RoundsWon : team2RoundsWon;
			const isFinalWin = winnerRoundsWon >= 2 || currentRound === 3;
			
			winTeamNameEl.textContent = teamName;
			winTeamNameEl.style.color = teamColor;
			winMessageEl.textContent = isFinalWin
				? "gewinnt das ganze Spiel! Herzlichen Glückwunsch!"
				: `hat Runde ${currentRound} gewonnen!`;
			nextRoundBtn.textContent = isFinalWin ? "Spiel beenden" : "Zur nächsten Runde →";
			
			showScreen(winScreen);
			
			nextRoundBtn.onclick = () => {
				if (isFinalWin) {
					resetMatch();
					openMenuScreen();
					return;
				}

				currentRound += 1;
				updateRoundUI();
				resetBoard();
				openBoardScreen();
			};
		}

		function normalizeInitial(answer) {
			const first = answer.trim().charAt(0).toUpperCase();
			const aliasMap = { "Ä": "A", "Ö": "O", "Ü": "U", "Ã„": "A", "Ã–": "O", "Ãœ": "U" };
			return aliasMap[first] || first;
		}

		function getQuestionsForLetter(letter) {
			return QUESTION_BANK.filter((entry) => normalizeInitial(entry.answer) === letter);
		}

		function hideAnswer() {
			answerLineEl.textContent = "";
			answerLineEl.classList.add("hidden");
		}

		function setActiveCell(activeCell) {
			hexCells.forEach((cell) => cell.classList.remove("active"));
			activeCell.classList.add("active");
		}

		function setActiveCellGreen(activeCell) {
			activeCell.classList.remove("active");
			activeCell.classList.add("active-green");
		}

		function setActiveCellOrange(activeCell) {
			activeCell.classList.remove("active");
			activeCell.classList.add("active-orange");
		}

		function startBlockCountdown(blockedTeamLabel) {
			// Clear existing timer if running
			if (countdownTimer) {
				clearInterval(countdownTimer);
			}

			let remaining = 30;
			countdownTextEl.textContent = `${blockedTeamLabel} muss 30 Sekunden nicht antworten.`;
			countdownNumberEl.textContent = remaining;
			countdownOverlay.classList.remove("hidden");

			countdownTimer = setInterval(() => {
				remaining -= 1;
				countdownNumberEl.textContent = remaining;
				
				if (remaining <= 0) {
					countdownOverlay.classList.add("hidden");
					clearInterval(countdownTimer);
					countdownTimer = null;
				}
			}, 1000);
		}

		function pickRandomMinusQuestion() {
			const available = MINUS_QUESTION_POOL.filter((entry) => !usedMinusQuestionKeys.has(getQuestionKey(entry)));
			if (available.length === 0) {
				return null;
			}
			const idx = Math.floor(Math.random() * available.length);
			const chosen = available[idx];
			usedMinusQuestionKeys.add(getQuestionKey(chosen));
			return chosen;
		}

		function removeTwoConsecutiveColoredCells(className) {
			const coloredIndices = [];
			hexCells.forEach((cell, idx) => {
				if (cell.classList.contains(className)) {
					coloredIndices.push(idx);
				}
			});

			if (coloredIndices.length === 0) {
				return;
			}

			let pair = null;
			for (const idx of coloredIndices) {
				const neighbors = NEIGHBORS[idx] || [];
				const neighbor = neighbors.find((n) => hexCells[n].classList.contains(className));
				if (neighbor !== undefined) {
					pair = [idx, neighbor];
					break;
				}
			}

			if (!pair && coloredIndices.length >= 2) {
				pair = [coloredIndices[0], coloredIndices[1]];
			}

			if (!pair) {
				hexCells[coloredIndices[0]].classList.remove("active", "active-green", "active-orange");
				return;
			}

			hexCells[pair[0]].classList.remove("active", "active-green", "active-orange");
			hexCells[pair[1]].classList.remove("active", "active-green", "active-orange");
		}

		function closeMinusPopup() {
			minusPopupAnswerEl.classList.add("hidden");
			minusPopupOverlay.classList.add("hidden");
		}

		function openMinusPopup(targetClass, selfClass) {
			minusTargetClass = targetClass;
			minusSelfClass = selfClass;
			const randomQA = pickRandomMinusQuestion();
			if (!randomQA) {
				return false;
			}
			minusPopupQuestionEl.textContent = randomQA.question;
			minusPopupAnswerEl.textContent = `Antwort: ${randomQA.answer}`;
			minusPopupAnswerEl.classList.add("hidden");
			minusPopupOverlay.classList.remove("hidden");
			return true;
		}

		function pickRandomAuctionQuestion(previousQuestion = "") {
			const available = AUCTION_QUESTION_POOL.filter((question) => {
				return !usedAuctionQuestions.has(question) && question !== previousQuestion;
			});

			if (available.length === 0) {
				return null;
			}

			const idx = Math.floor(Math.random() * available.length);
			const chosen = available[idx];
			usedAuctionQuestions.add(chosen);
			return chosen;
		}

		function addThreeConsecutiveColoredCells(className) {
			const isFreeCell = (idx) => {
				const cell = hexCells[idx];
				return !cell.classList.contains("active-green") && !cell.classList.contains("active-orange");
			};

			const paintCells = (indices) => {
				indices.forEach((idx) => {
					hexCells[idx].classList.remove("active");
					hexCells[idx].classList.add(className);
				});
			};

			const teamIndices = [];
			hexCells.forEach((cell, idx) => {
				if (cell.classList.contains(className)) {
					teamIndices.push(idx);
				}
			});

			// Team 1 -> vertical (same column, 3 rows).
			if (className === "active-green") {
				let best = null;
				for (const idx of teamIndices) {
					const row = Math.floor(idx / 5);
					const col = idx % 5;
					for (const dir of [-1, 1]) {
						for (let step = 1; step <= 4; step += 1) {
							const r1 = row + dir * step;
							const r2 = row + dir * (step + 1);
							const r3 = row + dir * (step + 2);
							if (r1 < 0 || r1 > 4 || r2 < 0 || r2 > 4 || r3 < 0 || r3 > 4) continue;
							const i1 = r1 * 5 + col;
							const i2 = r2 * 5 + col;
							const i3 = r3 * 5 + col;
							if (!(isFreeCell(i1) && isFreeCell(i2) && isFreeCell(i3))) continue;
							if (!best || step < best.distance) {
								best = { distance: step, cells: [i1, i2, i3] };
							}
						}
					}
				}

				if (best) {
					paintCells(best.cells);
					return;
				}

				for (let col = 0; col < 5; col += 1) {
					for (let row = 0; row <= 2; row += 1) {
						const i1 = row * 5 + col;
						const i2 = (row + 1) * 5 + col;
						const i3 = (row + 2) * 5 + col;
						if (isFreeCell(i1) && isFreeCell(i2) && isFreeCell(i3)) {
							paintCells([i1, i2, i3]);
							return;
						}
					}
				}
			}

			// Team 2 -> horizontal (same row, 3 columns).
			if (className === "active-orange") {
				let best = null;
				for (const idx of teamIndices) {
					const row = Math.floor(idx / 5);
					const col = idx % 5;
					for (const dir of [-1, 1]) {
						for (let step = 1; step <= 4; step += 1) {
							const c1 = col + dir * step;
							const c2 = col + dir * (step + 1);
							const c3 = col + dir * (step + 2);
							if (c1 < 0 || c1 > 4 || c2 < 0 || c2 > 4 || c3 < 0 || c3 > 4) continue;
							const i1 = row * 5 + c1;
							const i2 = row * 5 + c2;
							const i3 = row * 5 + c3;
							if (!(isFreeCell(i1) && isFreeCell(i2) && isFreeCell(i3))) continue;
							if (!best || step < best.distance) {
								best = { distance: step, cells: [i1, i2, i3] };
							}
						}
					}
				}

				if (best) {
					paintCells(best.cells);
					return;
				}

				for (let row = 0; row < 5; row += 1) {
					for (let col = 0; col <= 2; col += 1) {
						const i1 = row * 5 + col;
						const i2 = row * 5 + col + 1;
						const i3 = row * 5 + col + 2;
						if (isFreeCell(i1) && isFreeCell(i2) && isFreeCell(i3)) {
							paintCells([i1, i2, i3]);
							return;
						}
					}
				}
			}

			const fallback = [];
			for (let i = 0; i < hexCells.length && fallback.length < 3; i += 1) {
				if (isFreeCell(i)) fallback.push(i);
			}

			paintCells(fallback);
		}

		function closeAuctionPopup() {
			if (auctionTimer) {
				clearInterval(auctionTimer);
				auctionTimer = null;
			}
			auctionPopupOverlay.classList.add("hidden");
			auctionPopupStartBtn.disabled = false;
			auctionPopupAnotherBtn.disabled = false;
			auctionPopupStartWrap.classList.remove("hidden");
			auctionPopupResultActions.classList.add("hidden");
			auctionPopupTimerEl.textContent = "Zeit: 30 Sekunden";
		}

		function startAuctionCountdown() {
			let remaining = 30;
			auctionPopupTimerEl.textContent = `Zeit: ${remaining} Sekunden`;
			auctionPopupStartBtn.disabled = true;
			auctionPopupAnotherBtn.disabled = true;

			if (auctionTimer) {
				clearInterval(auctionTimer);
			}

			auctionTimer = setInterval(() => {
				remaining -= 1;
				auctionPopupTimerEl.textContent = `Zeit: ${remaining} Sekunden`;
				if (remaining <= 0) {
					clearInterval(auctionTimer);
					auctionTimer = null;
					auctionPopupTimerEl.textContent = "Zeit abgelaufen";
					auctionPopupStartWrap.classList.add("hidden");
					auctionPopupResultActions.classList.remove("hidden");
				}
			}, 1000);
		}

		function openAuctionPopup(teamClass) {
			auctionTeamClass = teamClass;
			auctionCardEl = teamClass === "active-green" ? team1AuctionIcon : team2AuctionIcon;
			const auctionQuestion = pickRandomAuctionQuestion();
			if (!auctionQuestion) {
				questionTextEl.textContent = "Keine neue Auktionsfrage mehr verfuegbar.";
				return;
			}
			auctionPopupQuestionEl.textContent = auctionQuestion;
			auctionPopupTimerEl.textContent = "Zeit: 30 Sekunden";
			auctionPopupAnotherBtn.disabled = false;
			auctionPopupStartBtn.disabled = false;
			auctionPopupStartWrap.classList.remove("hidden");
			auctionPopupResultActions.classList.add("hidden");
			auctionPopupOverlay.classList.remove("hidden");
		}

		function pickRandomQuestion(pool, previousQuestion) {
			if (pool.length === 0) return null;
			if (pool.length === 1) return pool[0];
			let candidate = pool[Math.floor(Math.random() * pool.length)];
			while (previousQuestion && candidate.question === previousQuestion.question) {
				candidate = pool[Math.floor(Math.random() * pool.length)];
			}
			return candidate;
		}

		function loadQuestionForLetter(letter, avoidRepeat) {
			const matchingQuestions = getQuestionsForLetter(letter);
			const unusedQuestions = matchingQuestions.filter((entry) => !usedMainQuestionKeys.has(getQuestionKey(entry)));
			currentPool = unusedQuestions.length > 0 ? unusedQuestions : matchingQuestions;
			hideAnswer();
			questionBadgeEl.textContent = letter;

			if (matchingQuestions.length === 0) {
				currentQuestion = null;
				questionTextEl.textContent = "Keine neue Frage mehr fuer diesen Buchstaben verfuegbar.";
				return;
			}

			const previous = avoidRepeat ? currentQuestion : null;
			currentQuestion = pickRandomQuestion(currentPool, previous);
			if (!currentQuestion) {
				currentQuestion = currentPool[0];
			}
			usedMainQuestionKeys.add(getQuestionKey(currentQuestion));
			questionTextEl.textContent = currentQuestion.question;
		}

		hexCells.forEach((cell) => {
			cell.addEventListener("click", () => {
				selectedLetter = cell.textContent.trim().toUpperCase();
				setActiveCell(cell);
				loadQuestionForLetter(selectedLetter, false);
			});
		});

		newQuestionButton.addEventListener("click", () => {
			if (!selectedLetter) {
				questionBadgeEl.textContent = "!";
				questionTextEl.textContent = "Waehle zuerst einen Buchstaben aus.";
				hideAnswer();
				return;
			}
			loadQuestionForLetter(selectedLetter, true);
		});

		showAnswerButton.addEventListener("click", () => {
			if (!currentQuestion) {
				questionTextEl.textContent = "Waehle zuerst einen Buchstaben aus.";
				return;
			}
			answerLineEl.textContent = `Antwort: ${currentQuestion.answer}`;
			answerLineEl.classList.remove("hidden");
		});

		team1Btn.addEventListener("click", () => {
			const activeCell = document.querySelector(".hex-cell.active");
			if (activeCell) {
				setActiveCellGreen(activeCell);
				if (hasWinningPathVertical("active-green")) {
					showWinScreen("Team 1", "#38be18");
				}
			}
		});

		team2Btn.addEventListener("click", () => {
			const activeCell = document.querySelector(".hex-cell.active");
			if (activeCell) {
				setActiveCellOrange(activeCell);
				if (hasWinningPathHorizontal("active-orange")) {
					showWinScreen("Team 2", "#ff7a3b");
				}
			}
		});



		team1BlockIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			if (!markCardUsed(team1BlockIcon)) return;
			startBlockCountdown("Team 2");
		});

		team2BlockIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			if (!markCardUsed(team2BlockIcon)) return;
			startBlockCountdown("Team 1");
		});

		team1MinusIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			if (team1MinusIcon.dataset.used === "true") return;
			const opened = openMinusPopup("active-orange", "active-green");
			if (!opened) {
				questionTextEl.textContent = "Keine neue Minus-Frage mehr verfuegbar.";
				return;
			}
			markCardUsed(team1MinusIcon);
		});

		team2MinusIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			if (team2MinusIcon.dataset.used === "true") return;
			const opened = openMinusPopup("active-green", "active-orange");
			if (!opened) {
				questionTextEl.textContent = "Keine neue Minus-Frage mehr verfuegbar.";
				return;
			}
			markCardUsed(team2MinusIcon);
		});

		team1AuctionIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			openAuctionPopup("active-green");
		});

		team2AuctionIcon.addEventListener("click", (event) => {
			event.stopPropagation();
			openAuctionPopup("active-orange");
		});

		minusPopupCorrectBtn.addEventListener("click", () => {
			removeTwoConsecutiveColoredCells(minusTargetClass);
			closeMinusPopup();
		});

		minusPopupShowAnswerBtn.addEventListener("click", () => {
			minusPopupAnswerEl.classList.remove("hidden");
		});

		minusPopupWrongBtn.addEventListener("click", () => {
			removeTwoConsecutiveColoredCells(minusSelfClass);
			closeMinusPopup();
		});

		auctionPopupStartBtn.addEventListener("click", () => {
			startAuctionCountdown();
		});

		auctionPopupAnotherBtn.addEventListener("click", () => {
			const nextQuestion = pickRandomAuctionQuestion(auctionPopupQuestionEl.textContent);
			if (!nextQuestion) {
				auctionPopupAnotherBtn.disabled = true;
				auctionPopupQuestionEl.textContent = "Keine weitere neue Auktionsfrage verfuegbar.";
				return;
			}
			auctionPopupQuestionEl.textContent = nextQuestion;
		});

		auctionPopupCloseBtn.addEventListener("click", () => {
			closeAuctionPopup();
		});

		auctionPopupSuccessBtn.addEventListener("click", () => {
			if (auctionCardEl) {
				markCardUsed(auctionCardEl);
			}
			addThreeConsecutiveColoredCells(auctionTeamClass);
			auctionCardEl = null;
			closeAuctionPopup();
		});

		auctionPopupFailBtn.addEventListener("click", () => {
			auctionCardEl = null;
			closeAuctionPopup();
		});

		updateRoundUI();
		updateResponsiveMetrics();
		window.addEventListener("resize", updateResponsiveMetrics);
		window.addEventListener("orientationchange", updateResponsiveMetrics);
		setTimeout(openMenuScreen, 2500);
		startButton.addEventListener("click", () => {
			resetMatch();
			openQuestionsModeScreen();
		});
		backToMenuButton.addEventListener("click", openMenuScreen);
		showBoardButton.addEventListener("click", openBoardScreen);
		boardBackButton.addEventListener("click", openQuestionsModeScreen);

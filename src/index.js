import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// return within render () distinguishes between things that React is going to 
// alter on the DOM and things that are merely there to aid or make possible the
// changes caused by render. So, you can get a bunch of function calls or var
// decs, but return () won't return those, but the JSX or equivalent
// This creates a component "called" with <Square /> where what's written after
// Square and before the / is part of the props arguments passed by an
// upper level component to a lower level one className= is just like class=
// When debugging, ctrl F to find all mentions of the offenders because the 
// error message may be misleading you as to the area where the problems lie
function Square(props) {
	return (
		<button 
			className="square" 
			onClick={props.onClick}
		>
		  {props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return ( 
			<Square 
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
			/>
		);
	}
/* The args to this.renderSquare never change. The early state of the app where
the board was filled with the numbers and then replaice with X's and whatnot
didn't imply some kind of change to the numbers below. Also, this returns not 
just a board state from JSX, but also a bunch of event listeners. Every element
of the HTML and JS needs to be rendered?
*/
	render() {
	  return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
	  );
	}
} 
  
class Game extends React.Component {
 constructor(props) {
	 super(props);
	 this.state = {
		 history: [
			 {
				 squares: Array(9).fill(null),
			 }
		 ],
		 xIsNext: true,
		 stepNumber: 0,
	 };
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
		  xIsNext: (step % 2) === 0,
		})
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = [...current.squares];
		if (detectWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X': 'O';
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,
		});
	}
/* Within a component, how does React know when it's looking at JSX? Is it merely
the presence of <>? 
*/
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = detectWinner(current.squares);
		const moves = history.map((step, move) => {
			const listElements = move ?
				`Go to move # ${move}`:
				`Go to game start`;
			return (
				<li>
					<button onClick={() => this.jumpTo(move)}>{listElements}</button>
				</li>
			);
		});
		let status;
		if (winner) {
			status = `Winner: ${winner}`
		} else {
			status = `Next player: ${this.state.xIsNext ? 'X': 'O'}`;
		}

	  return (
			<div className="game">
				<div className="game-board">
				<Board 
					squares={current.squares}
					onClick={(i) => this.handleClick(i)}
				/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
	  );
	}
}
  
	function detectWinner(squares) {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 5, 6]
		];
		for (let index = 0; index < lines.length; index++) {
			const [a, b, c] = lines[index]
			if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
				return squares[a];
			}
		}
		return null
	}
	
  ReactDOM.render(
	<Game />,
	document.getElementById('root')
  );
  
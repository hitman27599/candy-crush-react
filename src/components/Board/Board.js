import React,{useState,useEffect} from 'react'
import './Board.css'
import Blue from '../../images/blue-candy.png';
import Green from '../../images/green-candy.png';
import Orange from '../../images/orange-candy.png';
import Purple from '../../images/purple-candy.png';
import Red from '../../images/red-candy.png';
import Yellow from '../../images/yellow-candy.png';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

const Board = (/*{candyColors,colorArray,width,setColorArray}*/) => {
    const [squareBeingDragged , setSquareBeingDragged ] = useState(null);
    const [squareBeingReplaced , setSquareBeingReplaced ] = useState(null);
    const [score,setScore] = useState(0);
    const width = 8;
    const candyColors=[Blue,Orange, Green,Red,Purple,Yellow];
    

    const [colorArray,setColorArray] = useState([]);

    useEffect(()=>{
        const randomColorArrangement = [];
        for(let i=0; i < width * width ;i++){
            const randomColor = candyColors[Math.floor(Math.random()*candyColors.length)];
            randomColorArrangement.push(randomColor);
        }
        setColorArray(randomColorArrangement);
    },[]);
    
    
    const checkColumn = (j)=> {

        const length = 7 + (8-j)*8;
        for(let i=0;i<=length;i++){
            const column = [];
            for(let k=0;k<j;k++){
                column.push(i+(width*k));
            }
            const reqColor = colorArray[i];
            if(column.every(square => 
                colorArray[square] === reqColor
            )){
                return true;
            }
        }
        return false;
    }

    const changeColumn = (j)=> {

        const colorArray1 = colorArray;

        const length = 7 + (8-j)*8;
        for(let i=0;i<=length;i++){
            const column = [];
            for(let k=0;k<j;k++){
                column.push(i+(width*k));
            }
            const reqColor = colorArray[i];
            if(column.every(square => 
                (colorArray[square] === reqColor) && (colorArray[square]!== '')
            )){
                column.forEach(square => colorArray1[square]='');
                setColorArray(colorArray1);
                setScore(score + column.length*10);
            }
        }
        
    }

    const checkRow = (j) => {

        for(let i=0;i<64;i++){
            if(8-(i%8)>=j){
                const row=[];
                for(let k=0;k<j;k++){
                    row.push(i+k);
                }
                const reqColor = colorArray[i];
                if(row.every(square => 
                    colorArray[square] === reqColor
                )){
                    return true;
                }
            }
        }
        return false;
        
    }

    const changeRow = (j) => {

        const colorArray1 = colorArray;

        for(let i=0;i<64;i++){
            if(8-(i%8)>=j){
                const row=[];
                for(let k=0;k<j;k++){
                    row.push(i+k);
                }
                const reqColor = colorArray[i];
                if(row.every(square => 
                    (colorArray[square] === reqColor) && (colorArray[square]!== '')
                )){
                    row.forEach(square => colorArray1[square]='');
                    setColorArray(colorArray1);
                    setScore(score + row.length*10);
                }
            }
        }
        
    }

    const moveIntoSquarebelow = () => {
        const colorArray1 = colorArray;
        for(let i=63;i>7;i--){
            if(colorArray1[i] === ''){
                let steps = i-width;
                while(steps >=0){
                    if(colorArray1[steps]!== ''){
                        colorArray1 [i] = colorArray1 [steps];
                        colorArray1[steps] ='';
                        break;
                    }
                    steps -= width;
                }
            }
        }
        setColorArray(colorArray1);
    }

    const checkPattern = () => {
        for(let j=8;j>=3;j--){
            if(checkColumn(j)){return true};
            if(checkRow(j)){return true};
        }
        return false;
    }

    const changePattern = () => {
        for(let j=8;j>=3;j--){
            changeColumn(j);
            changeRow(j);
        }
    }

    const fillSquares = () => {
        const colorArray1 = colorArray;
        for(let i= 0; i <64;i++){
            if(colorArray1[i] === ''){
                colorArray1[i] = candyColors[Math.floor(Math.random()*candyColors.length)];
            }
        }
        setColorArray(colorArray1);
    }

    const dragStart = (e) => {
        // console.log(e.target);
        setSquareBeingDragged(e.target);
    }
    const dragDrop = (e) => {
        // console.log(e.target);
        setSquareBeingReplaced(e.target);
    }
    const dragEnd = (e) => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id')) ;
        const squareBeingreplacedId = parseInt(squareBeingReplaced.getAttribute('data-id')) ;

        if(checkInterChange(squareBeingDraggedId,squareBeingreplacedId)){

            colorArray[squareBeingreplacedId] = squareBeingDragged.getAttribute('src');
            colorArray[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');
            setColorArray([...colorArray]);      
            if(checkPattern()){
                changePattern();
                moveIntoSquarebelow();
                fillSquares();
                setColorArray([...colorArray]);
            }else{
                colorArray[squareBeingreplacedId] = squareBeingReplaced.getAttribute('src');
                colorArray[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
                setColorArray(colorArray);
                setSquareBeingDragged(null);
                setSquareBeingReplaced(null);
            }

            // console.log(squareBeingDraggedId);
            // console.log(squareBeingreplacedId);
        }

    }

    const checkInterChange = (a,b) => {
        if(a<b){
            let temp = b;
            b=a;
            a=temp;
        }

        if(a - width === b){
            return true;
        }
        if(a-1 === b && a-b<8){
            return true;
        }

        return false;
    }

    useEffect(()=>{
        const timer= setInterval(()=>{
        if(checkPattern()){
            changePattern();
            moveIntoSquarebelow();
            fillSquares();
            setColorArray([...colorArray]);
        }
        },100);
    },[colorArray])



    return (
        <>
            <div className="board">
                <div className="square">
                    {colorArray.map((color,index)=>(
                        <img 
                            className="squareImage" 
                            key={index} 
                            src={color} 
                            alt={color}
                            data-id={index}
                            draggable={true}
                            onDragStart={(e)=>{dragStart(e)}}
                            onDragOver={(e) => e.preventDefault()} 
                            onDragEnter={(e) => e.preventDefault()} 
                            onDragLeave={(e) => e.preventDefault()}
                            onDrop={(e)=>{dragDrop(e)}}
                            onDragEnd={(e)=>{dragEnd(e)}}
                        />
                    ))}
                </div>
                <ScoreBoard score={score} />
            </div>
        </>
    )
}

export default Board

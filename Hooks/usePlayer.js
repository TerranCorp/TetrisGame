import { useState, useCallback } from "react";
import { STAGE_WIDTH, checkCollision } from "../gameHelpers";
import { TETROMINOS, randomTetromino } from "../tetrominos";


export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const rotate = (matrix, direction) => {
    // Make the rows to become cols (transpose)
    //makes all the rows in the array to become columns
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );

    //Reverse each row to get a rotated matrix
    //seperate into two things due to depends on what direction moving in...if x > 0 == clockwise... to the right else x < 0 -> left

    if (direction > 0) {
      return rotatedTetro.map((row) => row.reverse());
    }
    return rotatedTetro.reverse();
  };

  // "Most advanced funtion in this tutorial"
  const playerRotate = (stage, direction) => {
    //this gives a complete clone of your player .. so that we dont mutate the state
    const clonedPlayer = JSON.parse(JSON.stringify(player));

    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);

    //so that it cant rotate outside of bounds (not including setplayer)

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset; //keeps track of steps moving to side back and brorth

      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > clonedPlayer.tetromino[0].length) {
        //rotating it back
        rotate(clonedPlayer.tetromino, -direction);
        clonedPlayer.pos.x = pos;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, //positioning the tetromino in the stage
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};

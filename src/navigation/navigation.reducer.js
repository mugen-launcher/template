import { SELECT_CHARACTER_ONE } from "./action/selectCharacterOne.action";
import { UNSELECT_CHARACTER_ONE } from "./action/unselectCharacterOne.action";
import { SELECT_CHARACTER_TWO } from "./action/selectCharacterTwo.action";
import { UNSELECT_CHARACTER_TWO } from "./action/unselectCharacterTwo.action";
import { SWITCH_MODE } from "./action/switchMode.action";
import TRAINING from "./mode/training.mode";
import VERSUS from "./mode/versus.mode";
import TRAINING_SELECTING_CHARACTER_ONE from "./state/trainingSelectingCharacterOne.state";
import TRAINING_SELECTING_CHARACTER_TWO from "./state/trainingSelectingCharacterTwo.state";
import TRAINING_SELECTING_STAGE from "./state/trainingSelectingStage.state";
import TRAINING_FIGHTING from "./state/trainingFighting.state";
import VERSUS_SELECTING_CHARACTERS from "./state/versusSelectingCharacters.state";
import VERSUS_SELECTING_CHARACTER_ONE from "./state/versusSelectingCharacterOne.state";
import VERSUS_SELECTING_CHARACTER_TWO from "./state/versusSelectingCharacterTwo.state";
import VERSUS_SELECTING_STAGE from "./state/versusSelectingStage.state";
import VERSUS_FIGHTING from "./state/versusFighting.state";

function selectCharacterOne(data, action) {
  const newData = {
    ...data,
    characterOne: action.character,
    characterOneCategoryIndex: action.categoryIndex,
    characterOneIndex: action.characterIndex,
  };

  if (data.state === TRAINING_SELECTING_CHARACTER_ONE) {
    newData.state = TRAINING_SELECTING_CHARACTER_TWO;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTERS) {
    newData.state = VERSUS_SELECTING_CHARACTER_TWO;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_ONE) {
    newData.state = VERSUS_SELECTING_STAGE;
    return newData;
  }

  throw new Error(`Unable to select character one in state: ${data.state}`);
}

function unselectCharacterOne(data) {
  const newData = { ...data };
  if (newData.characterOne) {
    delete newData.characterOne;
  }

  if (data.state === TRAINING_SELECTING_CHARACTER_TWO) {
    newData.state = TRAINING_SELECTING_CHARACTER_ONE;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_TWO) {
    newData.state = VERSUS_SELECTING_CHARACTERS;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_STAGE) {
    newData.state = VERSUS_SELECTING_CHARACTER_ONE;
    return newData;
  }

  throw new Error(`Unable to unselect character one in state: ${data.state}`);
}

function selectCharacterTwo(data, action) {
  const newData = {
    ...data,
    characterTwo: action.character,
    characterTwoCategoryIndex: action.categoryIndex,
    characterTwoIndex: action.characterIndex,
  };

  if (data.state === TRAINING_SELECTING_CHARACTER_TWO) {
    newData.state = TRAINING_SELECTING_STAGE;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTERS) {
    newData.state = VERSUS_SELECTING_CHARACTER_ONE;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_TWO) {
    newData.state = VERSUS_SELECTING_STAGE;
    return newData;
  }

  throw new Error(`Unable to select character two in state: ${data.state}`);
}

function unselectCharacterTwo(data) {
  const newData = { ...data };
  if (newData.characterTwo) {
    delete newData.characterTwo;
  }

  if (data.state === TRAINING_SELECTING_STAGE) {
    newData.state = TRAINING_SELECTING_CHARACTER_TWO;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_ONE) {
    newData.state = VERSUS_SELECTING_CHARACTERS;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_STAGE) {
    newData.state = VERSUS_SELECTING_CHARACTER_TWO;
    return newData;
  }

  throw new Error(`Unable to unselect character two in state: ${data.state}`);
}

function switchMode(data) {
  const newData = { ...data };

  if (data.state === TRAINING_SELECTING_CHARACTER_ONE) {
    newData.mode = VERSUS;
    newData.state = VERSUS_SELECTING_CHARACTERS;
    return newData;
  }

  if (data.state === TRAINING_SELECTING_CHARACTER_ONE) {
    newData.mode = VERSUS;
    newData.state = VERSUS_SELECTING_CHARACTERS;
    return newData;
  }

  if (data.state === TRAINING_SELECTING_CHARACTER_TWO) {
    newData.mode = VERSUS;
    newData.state = VERSUS_SELECTING_CHARACTER_TWO;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTERS) {
    newData.mode = TRAINING;
    newData.state = TRAINING_SELECTING_CHARACTER_ONE;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_TWO) {
    newData.mode = TRAINING;
    newData.state = TRAINING_SELECTING_CHARACTER_TWO;
    return newData;
  }

  if (data.state === VERSUS_SELECTING_CHARACTER_ONE) {
    newData.mode = TRAINING;
    newData.state = TRAINING_SELECTING_CHARACTER_ONE;
    return newData;
  }

  throw new Error(`Unable to switch mode in state: ${data.state}`);
}

export default function navigationReducer(data, action) {
  switch (action.type) {
    case SWITCH_MODE:
      return switchMode(data);

    case SELECT_CHARACTER_ONE:
      return selectCharacterOne(data, action);

    case UNSELECT_CHARACTER_ONE:
      return unselectCharacterOne(data);

    case SELECT_CHARACTER_TWO:
      return selectCharacterTwo(data, action);

    case UNSELECT_CHARACTER_TWO:
      return unselectCharacterTwo(data);
  }
  return state;
}

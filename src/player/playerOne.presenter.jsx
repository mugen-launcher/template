import React from "react";
import useInput from "../input/useInputPlayerOne.hook";
import useCategories from "../configuration/useCategories.hook";
import useCategoryIndex from "../category/useCategoryIndex.hook";
import PlayerOne from "./playerOne.view";

export default function PlayerOnePresenter() {
  const categories = useCategories();
  const input = useInput();
  const categoryIndex = useCategoryIndex(categories, input);

  const category = categories[categoryIndex];


  return <PlayerOne category={category}/>;
}

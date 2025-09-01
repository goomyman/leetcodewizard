import { StackItemType, StackItemState, getRandomColor, StackItemInputDto } from "./StackItemConstants";

export function createStackItem(
  input: StackItemInputDto,
  id: number,
  state: StackItemState = StackItemState.Start
): StackItemType {
  return {
    id,
    state,
    color: input.color ?? getRandomColor(),
    text: input.text,
    level: input.level,
  };
}

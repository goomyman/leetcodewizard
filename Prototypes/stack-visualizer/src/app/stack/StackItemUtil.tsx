import { StackItemType, StackItemInputDto } from "./StackItemConstants"; 
import { getRandomColor, StackItemState, } from "./StackItemConstants"; 

export function createStackItem(input: StackItemInputDto, id: number): StackItemType {
  return {
    id,
    state: StackItemState.Start,
    color: input.color ?? getRandomColor(),
    text: input.text,
    level: input.level ?? undefined,
  };

}

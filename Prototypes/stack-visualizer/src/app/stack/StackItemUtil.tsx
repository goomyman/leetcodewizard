import { StackItemType, StackItemInputDto } from "./StackItemConstants"; 
import { getRandomColor } from "./StackItemConstants"; 

export function createStackItem(input: StackItemInputDto, id: number): StackItemType {
  return {
    id,
    state: "start",
    color: input.color ?? getRandomColor(),
    text: input.text,
    level: input.level ?? undefined,
  };

}

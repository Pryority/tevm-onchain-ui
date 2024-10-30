export enum LayoutType {
	Flow = 0,
	Grid = 1,
	Flex = 2,
}

export const LAYOUT_TYPE_MAP: { [key: string]: LayoutType } = {
	Flow: LayoutType.Flow,
	Grid: LayoutType.Grid,
	Flex: LayoutType.Flex,
};

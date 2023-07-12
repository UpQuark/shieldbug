import {Groups, Newspaper, ShoppingCart, Videocam} from "@mui/icons-material";
import * as React from "react";


export interface CategoryType {
	label: string;
	value: string;
	icon: React.ReactNode;
}
export const CategoryTypes: CategoryType[] = [
	{ label: 'News', value: 'news', icon: <Newspaper/>},
	{ label: 'Social Media', value: 'social_media', icon: <Groups/>},
	{ label: 'Shopping', value: 'shopping', icon: <ShoppingCart/>},
	{ label: 'Video Streaming', value: 'streaming', icon: <Videocam/>},
	// Add more categories here
];
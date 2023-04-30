import {BiNetworkChart, BiNews, BiShoppingBag, BiVideo} from "react-icons/all";
import * as React from "react";


export interface CategoryType {
	label: string;
	value: string;
	icon: React.ReactNode;
}
export const CategoryTypes: CategoryType[] = [
	{ label: 'News', value: 'news', icon: <BiNews/>},
	{ label: 'Social Media', value: 'social_media', icon: <BiNetworkChart/>},
	{ label: 'Shopping', value: 'shopping', icon: <BiShoppingBag/>},
	{ label: 'Video Streaming', value: 'streaming', icon: <BiVideo/>},
	// Add more categories here
];
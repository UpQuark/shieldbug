import {BiNetworkChart, BiNews, BiShoppingBag, BiVideo} from "react-icons/all";
import * as React from "react";

export const CategoryTypes = [
	{ name: 'News', value: 'news', icon: <BiNews/>},
	{ name: 'Social Media', value: 'social_media', icon: <BiNetworkChart/>},
	{ name: 'Shopping', value: 'shopping', icon: <BiShoppingBag/>},
	{ name: 'Video Streaming', value: 'streaming', icon: <BiVideo/>},
	// Add more categories here
];
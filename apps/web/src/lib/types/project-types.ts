import { StaticImageData } from "next/image"

export interface Project {
	type: string
	title: string
	description: string
	website: string
	github?: string
	features?: string[]
	image: StaticImageData

}
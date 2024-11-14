import type { Node } from 'unist'

interface UnistNode extends Node {
    type: string
    name?: string
    tagName?: string
    value?: string
    properties?: {
      __raw_string__?: string
      [key: string]: unknown
    } & NpmCommands
    attributes?: {
      name: string
      value: unknown
      type?: string
    }[]
    children?: UnistNode[]
  }
interface UnistTree extends Node {
    children: UnistNode[]
  }
  
interface NpmCommands {
    __npmCommand__?: string
    __yarnCommand__?: string
    __pnpmCommand__?: string
    __bunCommand__?: string
  }

export type { UnistNode, UnistTree, NpmCommands }
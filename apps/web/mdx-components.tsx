import type { MDXComponents } from 'mdx/types'
import { components as uiComponents } from '@ui/blocks/mdx'
 
function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...uiComponents
    
  }
}

export { useMDXComponents }
import React from 'react'
import { genPageMetadata } from '@/lib/utils/seo'
import BlogLayout from '@/components/blog/blog-layout'


export const metadata = genPageMetadata({ title: 'Blog' })

const BlogPage = () => <div className='page-container'><BlogLayout /></div>


export default BlogPage
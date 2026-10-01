import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: string
  variant?: 'short-color' | 'long-color' | 'short-white' | 'long-white' | "custom"
}

const Logo: React.FC<Props> = ({ className, size = '', variant = 'short-color', ...props }) => {

  const logoImg = {
    'short-color': '/images/logo/logo-short-color.png',
    'long-color': '/images/logo/logo-long-color.png',
    'short-white': '/images/logo/logo-short-white.png',
    'long-white': '/images/logo/logo-long-white.png'
  }

  const getLogoImg = () => {
    switch (variant) {
      case 'short-color':
        return '/images/logo/logo-short-color.png'
      case 'long-color':
        return '/images/logo/logo-long-color.png'
      case 'short-white':
        return '/images/logo/logo-short-white.png'
      case 'long-white':
        return '/images/logo/logo-long-white.png'
      case 'custom':
        return '/images/logo/logo-custom.png'
      default:
        return '/images/logo/logo-short-color.png'
    }
  }
  
  return (
    <Link href="/" className={clsx('inline-block shrink-0 text-primary-600 p-2 dark:text-primary-500', className)}>
      <Image src={getLogoImg()} className='object-contain h-full w-auto' alt="Logo" width={100} height={100} />
    </Link>
  )
}

export default Logo

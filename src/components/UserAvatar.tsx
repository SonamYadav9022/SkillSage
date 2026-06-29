'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface UserAvatarProps {
  name?: string
  email?: string
  image?: string
}

export default function UserAvatar({
  name = 'User',
  email = '',
  image = '',
}: UserAvatarProps) {
  const router = useRouter()

  // Get initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent color based on the name
  const getAvatarColor = (
    fullName: string
  ) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ]
    const hash = fullName
      .split('')
      .reduce(
        (acc, char) =>
          acc + char.charCodeAt(0),
        0
      )
    return colors[hash % colors.length]
  }

  const initials = getInitials(name)
  const bgColor = getAvatarColor(name)

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/',
    })
  }

  const handleProfile = () => {
    router.push('/profile')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer transition-transform hover:scale-110">
            {image && (
              <AvatarImage
                src={image}
                alt={name}
              />
            )}
            <AvatarFallback
              className={`${bgColor} font-semibold text-white text-sm`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        {/* USER INFO */}
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground">
            {name}
          </p>
          {email && (
            <p className="text-xs text-muted-foreground truncate">
              {email}
            </p>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* PROFILE LINK */}
        <DropdownMenuItem
          onClick={handleProfile}
          className="cursor-pointer"
        >
          <span>👤 Profile</span>
        </DropdownMenuItem>

        {/* MY COURSES */}
        <DropdownMenuItem asChild>
          <Link
            href="/my-courses"
            className="cursor-pointer"
          >
            <span>📚 My Courses</span>
          </Link>
        </DropdownMenuItem>

        {/* CAREER COUNSELOR */}
        <DropdownMenuItem asChild>
          <Link
            href="/counselor"
            className="cursor-pointer"
          >
            <span>🎓 Career Counselor</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <span>🚪 Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
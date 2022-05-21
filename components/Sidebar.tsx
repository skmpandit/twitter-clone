import React from 'react';
import { BellIcon,HashtagIcon,BookmarkIcon,CollectionIcon,DotsCircleHorizontalIcon,MailIcon,UserIcon,HomeIcon,SparklesIcon } from "@heroicons/react/outline";
import SidebarRow from './SidebarRow';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Tweet } from '../typings';

 
function Sidebar() {
  const {data: session} = useSession();
  return (
    <div className='flex flex-col col-span-2 items-center px-4 md:items-start'>
        <img className='m-3 h-10 w-10 cursor-pointer rounded-full hover:bg-blue-100' src="/icons8-twitter.svg" alt="" />
        <SidebarRow Icon={HomeIcon} title="Home"/>
        <SidebarRow Icon={HashtagIcon} title="Explore"/>
        <SidebarRow Icon={BellIcon} title="Notifications"/>
        <SidebarRow Icon={MailIcon} title="Messages"/>
        <SidebarRow Icon={BookmarkIcon} title="Bookmarks"/>
        <SidebarRow Icon={CollectionIcon} title="Lists"/>
        <SidebarRow Icon={UserIcon} onClick={session ? signOut : signIn} title={session ? "Sign Out" : "Sign In"}/>
        <SidebarRow Icon={DotsCircleHorizontalIcon} title="More"/>
        <div className='mt-3 py-2 px-12 bg-twitter/80 rounded-full items-center flex cursor-pointer hover:bg-twitter ease-in-out duration-150'>
          <p className='text-lg text-white'>Tweet</p>
        </div>
        {session && (
          <div className='mt-12 flex items-center py-2 pl-2 pr-3 hover:bg-gray-300 rounded-full cursor-pointer'>
            <div>
              <img className='rounded-full' src={session?.user?.image} alt="" />
            </div>
            <div className='ml-2'>
              <p className='text-[15px] font-semibold'>{session?.user?.name}</p>
              <p className='text-[15px]'>@{session?.user?.name.replace(/\s+/g, '').toLowerCase()}</p>
            </div>
            <div className='ml-3'>
              <p className='font-semibold'>···</p>
            </div>
          </div>
        )}
    </div>
  )
}

export default Sidebar
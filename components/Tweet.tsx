import React, { useEffect, useState } from 'react';
import { Comment, CommentBody, Tweet } from '../typings';
import TimeAgo from "react-timeago";
import {ChatAlt2Icon,HeartIcon,SwitchHorizontalIcon,UploadIcon} from "@heroicons/react/outline";
import { fetchComments } from '../utils/fetchComments';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
    tweet: Tweet
}

function Tweet({tweet}: Props) {

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBoxVisble, setCommentBoxVisble] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const {data: session} = useSession();


    const refreshComments = async () => {
        const comments: Comment[] = await fetchComments(tweet._id)
        setComments(comments)
    }

    useEffect(() => {
        refreshComments()
    },[])

    const postComment = async () => {
        const commentInfo: CommentBody = {
            comment: input,
            username: session?.user?.name || 'Unknow User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
            tweetId: tweet._id,
        }
        const result = await fetch(`/api/addComment`,{
            body: JSON.stringify(commentInfo),
            method: 'POST',
        })
        const json = await result.json();
        const newTweets = await fetchComments();
        setComments(newTweets)

        toast('Comment Posted',{
            icon: '🚀',
        })
        return json
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        postComment();

        setInput("");
        setCommentBoxVisble(false);

    }

    // console.log(comments)

  return (
    <div className='flex flex-col space-x-3 border-y p-5 border-gray-100 hover:bg-gray-50'>
        <div className='flex space-x-3'>
            <img className='h-10 w-10 rounded-full object-cover' src={tweet.profileImg} alt="" />
            <div>
                <div className='flex items-center space-x-1'>
                    <p className='mr-1 font-bold'>{tweet.username}</p>
                    <p className='hidden text-sm text-gray-500 sm:inline'>@{tweet.username.replace(/\s+/g, '').toLowerCase()} ·</p>
                    <TimeAgo className='text-sm text-gray-500' date={tweet._createdAt}/>
                </div>
                <p>{tweet.text}</p>
                {tweet.image && <img src={tweet.image} alt="" className='m-5 ml-0 mb-1 rounded-lg object-cover shadow-sm' />}
            </div>
        </div>
        <div className='flex mt-5 justify-between px-10'>
            <div onClick={() => session && setCommentBoxVisble(!commentBoxVisble)}  className='flex items-center cursor-pointer space-x-3 text-gray-400'>
                <ChatAlt2Icon className='h-5 w-5 hover:text-blue-300'/>
                <p>{comments.length}</p>
            </div>
            <div className='flex items-center cursor-pointer space-x-3 text-gray-400'>
                <SwitchHorizontalIcon className='h-5 w-5 hover:text-green-300'/>
            </div>
            <div className='flex items-center cursor-pointer space-x-3 text-gray-400'>
                <HeartIcon className='h-5 w-5 hover:text-red-300'/>
            </div>
            <div className='flex items-center cursor-pointer space-x-3 text-gray-400'>
                <UploadIcon className='h-5 w-5 hover:text-blue-300'/>
            </div>
        </div>
        {/* Comment box logic */}
        {commentBoxVisble && (
            <form className='mt-3 flex space-x-3'>
                <input onChange={(e) => setInput(e.target.value)} value={input} className="flex-1 rounded-lg bg-gray-100 p-2 outline-none" type="text" placeholder='Write a Comment...' />
                <button  onClick={handleSubmit}  type='submit' disabled={!input} className='text-twitter disabled:text-gray-200'>Post</button>
            </form>
        )}
        {comments?.length > 0 && (
            <div className='my-2 mt-5 max-h-40 space-y-5 overflow-y-scroll border-t border-gray-100 p-5'>
                {comments.map((comment) => (
                    <div key={comment._id} className="relative flex space-x-2">
                        <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
                        <img className='mt-2 h-7 w-7 rounded-full object-cover' src={comment.profileImg} alt="" />
                        <div>
                            <div className='flex space-x-1 items-center'>
                                <p className='mr-1 font-bold'>{comment.username}</p>
                                <p className='hidden text-sm text-gray-500 lg:inline'>@{comment.username.replace(/\s+/g, '').toLowerCase()} ·</p>
                                <TimeAgo className='text-sm text-gray-500' date={comment._createdAt}/>
                            </div>
                            <p>{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) }
    </div>
  )
}

export default Tweet
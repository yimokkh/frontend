import  {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import Loader from "./Loader.jsx";
import AllTags from "./AllTags.jsx";

const Track = () => {
    const [isLoading, setLoading] = useState(false)
    const [allTagsOpened, setAllTagsOpened] = useState(false)
    const [track, setTrack] = useState({})
    const [hoverTag, setHoverTag] = useState(0)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function Init() {
            if (!params.id) return
            setLoading(true)
            const res = await axios.get(`${SERVER_URL}/api/tracks/${params.id}`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)

            })
            console.log(res.data)
            if (res.status === 200) {
                setTrack(res.data)
            }
            setLoading(false)
        }

        Init()
    }, [params.id])

    const addTagToTrack = async (tagId) => {
        const res = await axios.post(`${SERVER_URL}/api/tracks/${params.id}/tags/${tagId}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res.data)
        if (res.status === 200) {
            setTrack(prevState => {
                return {...prevState, tags: [res.data, ...prevState.tags]}
            })
            toast.success('Tag added!')
        }
    }
    const RemoveTagFromTrackSubmit = async (tagId) => {
        const res = await axios.delete(`${SERVER_URL}/api/tracks/${params.id}/tags/${tagId}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res.data)
        if (res.status === 200) {
            setTrack(prevState => {
                return {...prevState, tags: [...prevState.tags.filter((item) => item.id !== tagId)]}
            })
        }
    }


    if (isLoading || !track) return <Loader/>
    return (
        <>
            {allTagsOpened &&
                <AllTags addTagToTrack={addTagToTrack} closeAllTagsFunction={() => setAllTagsOpened(false)}/>}
            <button className={'fixed top-2 left-2 px-6 h-10 bg-primary rounded-xl'}
                    onClick={() => navigate('/')}>Главная
            </button>
            <div className={'flex flex-col items-center mt-10'}>

                <div className={'flex'}>
                    <div className={'ml-5 flex flex-col items-center'}>
                        <div className={'text-3xl uppercase'}>{track.name}</div>
                        <div className={'text-lg text-gray-600'}>{track.artist}</div>
                    </div>
                </div>
                <div style={{width: '40%'}} className={'flex w-full justify-between mt-10'}>
                    <div className={'w-full mr-10'}>
                        <div className={'ml-5'}>Теги:</div>
                        {track.tags && track.tags.length > 0 ?
                            <div className={'flex flex-col w-full relative'}>
                                {track.tags.map((tag) => (
                                    <div
                                        onMouseEnter={() => {
                                            setHoverTag(tag.id)
                                        }}
                                        onMouseLeave={() => {
                                            setHoverTag(0)
                                        }}
                                        className={'bg-primary rounded-xl w-full p-6 mt-5'} key={tag.id}>
                                        <div>{tag.text}</div>
                                        {tag.id === hoverTag && <div
                                            onClick={(e)=>{e.stopPropagation(); RemoveTagFromTrackSubmit(tag.id)}}
                                            className={'cursor-pointer p-2 rounded-xl bg-bg absolute bottom-3 right-3'}>Удалить
                                        </div>}
                                    </div>
                                ))}
                            </div>
                            : <div className={'text-xl ml-8 mt-5'}>Нет тегов</div>}
                    </div>
                    <button onClick={()=>setAllTagsOpened(true)} className={'bg-primary rounded-xl px-6 w-60 h-10'}>Добавить тэг</button>
                </div>
            </div>
        </>
    );
};

export default Track;
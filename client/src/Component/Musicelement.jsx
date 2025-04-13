import React, { useState, useRef, useEffect } from "react";
import "./style/style.css";
import { IoMdRepeat } from "react-icons/io";
import { TfiVolume } from "react-icons/tfi";
import { FaVolumeMute } from "react-icons/fa";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { TbRepeatOff } from "react-icons/tb";
import imgSrc from "../assets/default.png";
import MusicList from './Musiclist';
import { BsMusicPlayer } from "react-icons/bs";
import { IoMusicalNotesSharp } from "react-icons/io5";


const Musicelement = () => {
    //usestates (hooks part)
    //used to store component data
    const audioRef = useRef(new Audio());
    const [isHovered, setisHovered] = useState(false);
    const [musicDetails, setmusicDetails] = useState(null);
    const [isplay, setisPlay] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [musicListdata, setMusicListdata] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isrep, setisRep] = useState(false);
    const [ismute, setisMute] = useState(false);

    //functions for dragging songs
    const handleDragOver = (event) => {
        event.preventDefault();
        setisHovered(true);
    };
    const handleDragLeave = () => {
        setisHovered(false);
    };
    const handleDrop = (event) => {
        setisHovered(false);
        //choosing audio file 
        let file = event.dataTransfer.files[0];
        if (file && file.type === "audio/mpeg") {
            uploadAudio(file);
        } else {
            alert("Please Choose an Audio File");
        }
    };

    const uploadAudio = async (file) => {
        try {
            let formdata = new FormData();
            formdata.append("mp3file", file);

            const response = await fetch("http://localhost:8000/uploadsong", {
                method: "POST",
                body: formdata,
            });

            if (response.ok) {
                const data = await response.json();
                setmusicDetails(data);
                audioRef.current.src = `http://localhost:8000/uploads/${data.title}`;

                audioRef.current.addEventListener("loadedmetadata", () => {
                    setDuration(audioRef.current.duration);
                });
                audioRef.current.addEventListener("timeupdate", () => {
                    setCurrentTime(audioRef.current.currentTime);
                });

                audioRef.current.addEventListener("ended", () => {
                    setisPlay(false);
                });
            } else {
                alert("file not found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setisPlay(true);
        } else {
            audioRef.current.pause();
            setisPlay(false);
        }
    };

    const formatTime = (time) => {
        let min, sec;
        min = Math.floor(time / 60);
        sec = Math.floor(time % 60);

        //for adding 1 zero before any number e.g 04 we write 2 in min and sec
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const handleProgress = (e) => {
        let progress = e.currentTarget;
        //mouse position
        let clickedPos = e.clientX - progress.getBoundingClientRect().left;
        let progressWidth = progress.clientWidth;
        let seekTime = (clickedPos / progressWidth) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    };

    const fetchList = async () => {
        try {
            let getApi = await fetch(`http://localhost:8000/getItem`);
            let res = await getApi.json();
            setMusicListdata(res)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const selectedSong = (clickedSong) => {
        let audiourl = `http://localhost:8000/uploads/${clickedSong.audioName
            }`;

        audioRef.current.src = audiourl;
        audioRef.current.play();

        setisPlay(true);
        setmusicDetails(clickedSong);


    }


    const nextPlay = () => {
        const nextSong = (currentIndex + 1) % musicListdata.length;
        setCurrentIndex(nextSong);
        selectedSong(musicListdata[nextSong]);
    }
    const prevPlay = () => {
        const prevSong = (currentIndex - 1 + musicListdata.length) % musicListdata.length;
        setCurrentIndex(prevSong);
        selectedSong(musicListdata[prevSong]);
    }


    const toggleRepeat = () => {
        setisRep(!isrep);
    }

    const toggleMute = () => {
        setisMute(!ismute);
    }

    //for repeat
    useEffect(() => {
        audioRef.current.loop = isrep;
    }, [isrep])
    //for mute
    useEffect(() => {
        audioRef.current.muted = ismute;
    }, [ismute])
    return (
        <>
            <div className='player'>

                <div><span style={{ fontSize: 30,color:"black" }}><BsMusicPlayer /><span style={{ marginLeft: 20, fontFamily: 'algerian', fontSize: 25 ,color:"black"}}>Music Mania</span></span>
                    <h3><IoMusicalNotesSharp /> __🎶__<IoMusicalNotesSharp /> </h3></div>
                <hr />
                <div className="musicelement">
                    <div
                        className={`song_picture ${isHovered ? "hoverd" : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        
                        {musicDetails && (
                            <img
                                src={
                                    musicDetails.picture
                                        ? `data:image/jpeg;base64,${musicDetails.picture}`
                                        : imgSrc
                                }
                                alt="coder"
                            />
                        )}
                    </div>

                    <div className="progress">
                        <div className="time">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        <div className="progress_bar" onClick={handleProgress}>
                            <div
                                className="progress_line"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="song_detail">
                        <marquee behavior="" direction="">
                            {musicDetails && musicDetails.title}
                        </marquee>

                        <p>{musicDetails && musicDetails.artist}</p>
                    </div>

                    <div className="controls">
                        <button onClick={toggleRepeat}>
                            {isrep ? <IoMdRepeat /> : <TbRepeatOff />}
                        </button>

                        <div className="control_btn">
                            <button onClick={prevPlay}>
                                <TbPlayerTrackPrev />
                            </button>
                            <button className="play_" onClick={handlePlay}>
                                {" "}
                                {isplay ? <FaPause /> : <FaPlay />}
                            </button>
                            <button onClick={nextPlay}>
                                <TbPlayerTrackNext />
                            </button>
                        </div>

                        <button onClick={toggleMute}>
                            {ismute ? <FaVolumeMute /> : <TfiVolume />}
                        </button>
                    </div>
                    <hr  style={{width:300,opacity:.5,marginTop:30}}/>
                    <MusicList musicListdata={musicListdata} selectedSong={selectedSong} />
                </div></div>
        </>
    );
};

export default Musicelement;

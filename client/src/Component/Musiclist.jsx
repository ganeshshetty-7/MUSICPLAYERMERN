import React from "react";
import "./style/style.css";
import imgSrc from "../assets/default.png";
const Musiclist = ({ musicListdata, selectedSong }) => {

    if (!Array.isArray(musicListdata)) {
        return <div>No List</div>
    }

    const handlePlaysong = (element) => {
        console.log(element);
        selectedSong(element);
    }


    return (
        <div className="musicList">
            <ul className="ul_music">
                {musicListdata.map((element, index) => {

                    return (
                        <li key={index} onClick={() => handlePlaysong(element)}>
                            <img src={imgSrc} alt="MUSIC" />

                            <div className="song_name_list">
                                <p>{element.audioName}</p>


                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Musiclist;

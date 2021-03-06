import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0,
      isPlaying: false,
      hover: ""
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);   
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length -1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVol = e.target.value;
    this.audioElement.volume = newVol; 
    this.setState({ volume: newVol });
  }

  handleMouseOver(e){
    const currentHover = this.state.album.songs[e.target.innerText -1];
    this.setState({hover: currentHover});
  }

  handleMouseOut(e){
    this.setState({hover: ""});
  }

  hoverChange(song){
    if (this.state.currentSong === song && ((this.state.isPlaying === false && this.state.hover === song) || (this.state.isPlaying && this.state.hover!== song))){
      return 'ion-pause';
    }
    else if (this.state.currentSong === song && ((this.state.isPlaying && this.state.hover === song) || (this.state.isPlaying === false && this.state.hover !== song))){
      return 'ion-play';
    }
    else if (this.state.hover === song) {
      return 'ion-play';
    }
    else {
      return null;
    }
  }

  formatTime() {
    const minutes = Math.floor(this.audioElement.currentTime / 60);
    const seconds = Math.round(this.audioElement.currentTime % 60);
    if (seconds === 0 && minutes === 0) {
      return "-:--"
    } else if (seconds < 10) {
      return minutes + ":0" + seconds
    } else {
      return minutes + ":" + seconds
    }
  }

  totalTime() {
    const minutes = Math.floor(this.audioElement.duration / 60);
    const seconds = Math.round(this.audioElement.duration % 60);
    if (seconds === 0 && minutes === 0) {
      return "-:--"
    } else if (seconds < 10) {
      return minutes + ":0" + seconds
    } else {
      return minutes + ":" + seconds
    }
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt="album cover art"/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table className="table table-striped">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody className='songList'>
            {
            this.state.album.songs.map(( song, index ) =>
              <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                <td className="song-actions">
                  <button type="button" className="btn btn-outline-secondary">
                  <span className={this.hoverChange(song)}
                    onMouseOver={(e) => this.handleMouseOver(e)}
                    onMouseOut={(e) => this.handleMouseOut(e)}>
                        {this.state.hover === song ?
                          null :
                          this.state.currentSong !== song ?
                          this.state.album.songs.indexOf(song) + 1 :
                          null}
                    </span>
                  </button>
                </td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{song.duration}</td>
              </tr>
            )}
          </tbody>
         </table>
         <PlayerBar
          isPlaying={this.state.isPlaying} 
          currentSong={this.state.currentSong} 
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={() => this.formatTime()}
          totalTime={() => this.totalTime()}
          />
      </section>
    );
  }
}

export default Album;
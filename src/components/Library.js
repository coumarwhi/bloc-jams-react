import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }

  render() {
    return (
      <section class="p-3 mb-2 bg-secondary text-white">
        {
          this.state.albums.map( (album, index) =>
        <Link to={`/album/${album.slug}`} key={index}>
          <img className= "mr-0" src={album.albumCover} alt={album.title} />
          <div className="text-white">{album.title}</div>
          <div className="text-white">{album.artist}</div>
          <div className="text-white">{album.songs.length} songs</div>
        </Link>
          )
        }
      </section>
    );
  }
}

export default Library;
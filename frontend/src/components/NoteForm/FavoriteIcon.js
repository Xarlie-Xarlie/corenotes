import React from 'react'
import favoriteIcon from '../../assets/favorite-on.png'
import notFavoriteIcon from '../../assets/favorite-off.png'

const FavoriteIcon = ({ isFavorite, onClick }) => (
  <img
    className='cursor-pointer size-6'
    src={isFavorite ? favoriteIcon : notFavoriteIcon}
    alt={isFavorite ? 'Favorite' : 'Not Favorite'}
    onClick={onClick}
  />
)

export default FavoriteIcon

import React from 'react'
import Banner from '../../components/banner/Banner'
import RecentlyAdded from '../../components/banner/RecentlyAdded'

function Home() {
  return (
    <div className='bg-zinc-900 text-white px-10 py-8'>
      <Banner/>
      <RecentlyAdded/>
    </div>
  )
}

export default Home

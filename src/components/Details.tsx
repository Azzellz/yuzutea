import { isMobile } from '@/utils'

export default function Details() {
  return (
    <div className="main">
      <nav className="github">
        <a href="https://github.com/Azzellz">Github</a>
        {isMobile() && (
          <>
            <span>or</span>
            <a href="https://github.com/Azzellz/yuzutea">{'<Source />'}</a>
          </>
        )}
      </nav>
      {!isMobile() && (
        <div className="source">
          <a href="https://github.com/Azzellz/yuzutea" className="source-right">
            {'<Source />'}
          </a>
        </div>
      )}
      <span className="header-left">YuzuTea</span>
    </div>
  )
}

import { isMobile } from '@/utils'

export default function Details() {
  return (
    <div className="main">
      <nav className="github">
        {isMobile() ? (
          <>
            <a href="https://github.com/Azzellz">
              <img src="/images/icon/github.png" />
            </a>
            <a href="https://github.com/Azzellz/yuzutea">
              <img src="/images/icon/code.png" />
            </a>
          </>
        ) : (
          <a href="https://github.com/Azzellz">Github</a>
        )}
      </nav>
      {!isMobile() && (
        <div className="source">
          <a href="https://github.com/Azzellz/yuzutea" className="source-right">
            {'<Source />'}
          </a>
        </div>
      )}
      <span className="logo">YuzuTea</span>
    </div>
  )
}

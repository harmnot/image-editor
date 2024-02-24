import Link from 'next/link'

export default function NotFound() {
  return (
    <div className={`min-h-screen flex justify-center flex-col text-xl text-center m-auto`}>
      <h2>Page Not Found</h2>
      <Link className={'text-sm mt-4'} href="/">Return Home -></Link>
    </div>
  )
}

import notFoundImage from "../assets/notFound.gif";

export const PageNotfound = () => {
  return (
    <div className="container">
        <div>
            <div>
                <img src={notFoundImage} alt="not found"/>
            </div>
            <div>
                Page not found
            </div>
        </div>
    </div>
  )
}

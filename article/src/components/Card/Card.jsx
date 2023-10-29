import './card.scss'
const Card = ({ article }) => {
    return (
        <div className="card-item">
            {
                article.urlToImage ? (
                    <img src={article.urlToImage} alt="" />
                ) : (
                    <img className="card-image" src='src/assets/article.jpg' alt="Default" />

                )
            }
            <h2>{article.title || article.webTitle || article.headline.main}</h2>
            <p>{article.description || article.sectionName || article.section_name}</p>
            <p>{article.webPublicationDate || article.pub_date || article.publishedAt}</p>
            <span>{article.pillarName || article.subsection_name}</span>
            <a href={article.url || article.webUrl || article.web_url} className='' target='_blank'>read more </a>
        </div>
    )
}

export default Card
import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";   


export class News extends Component {

    static defaultProps = {
        country: "in",
        pageSize: 8,
        category: "general",
    }; 

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    };

    capitalize = (word)=>{
        word.toLowerCase();
        return word[0].toUpperCase() + word.slice(1);
    }

    // newTitle = this.capitalize(this.props.category);
    constructor(props){
        super(props);
        // console.log("Inside the Constructor in the News Component");
        this.state = {
            articles: [],
            loading: true, // we are using loading to show the loading gif 
            page: 1,
            totalResults: 0,
        }
        document.title = `${this.capitalize(this.props.category)} - NewsMonkey`;
    }

    // due to code repetetion we are maing a new function updteNews()
    
    async updateNews(){
        // console.log(this.state.page);
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true}); // gif visible
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.props.setProgress(70);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false, // as soon as the pages loads the gif is invisible
        });
        this.props.setProgress(100);
    }

    async componentDidMount(){ // This is used for fetching the news from the Newsapi website
        // console.log("cdm");
        this.updateNews();
    };

    fetchMoreData = async () => {
        console.log(this.state.page);       
        this.setState({page: this.state.page + 1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
        })
    };

  render() {
    return (
        <>
        <h1 style={{textAlign: "center", fontWeight: "bold", marginTop: "90px", marginBottom: "30px"}}>NewsMonkey - Top {this.capitalize(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />} {/* This is the spinner component call to show loading gif*/}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
            <div className="container">
            <div className="row">
                {this.state.articles.map((element)=>{
                    return (<div className="col-md-4" key={element.url}>
                        <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imgUrl={element.urlToImage} newsUrl={element.url} author={!element.author ? "Unknown" : element.author} date={element.publishedAt} source={element.source.name} />
                    </div>)
                })}
            </div>
            </div>
        </InfiniteScroll>
        </>
    )
  }
}

export default News
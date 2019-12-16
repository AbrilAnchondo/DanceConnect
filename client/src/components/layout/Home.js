import React, { Component } from 'react'
import axios from 'axios'


class Home extends Component {
    

    // componentDidMount () {
    //     axios.get("http://api.repo.nypl.org/api/v1/items/search?q=prints+depicting+dance&publicDomainOnly=true", {
    //         headers: {
    //             "Authorization": "Token token=e9avdv82tzqy12ct"
    //         }
    //     })
    //     .then(resp => resp.json())
    //     .then(console.log)
    // }

    render() {
        console.log(this.props)
        return (
            <div>
                <section className="home">
                    <div>
                    <h1>DanceConnect</h1>
                        <p>{this.props.username}</p>
                        <p>Meet other Dancers and Professionals in the field, create your Profile and Share your Story</p>
                    </div>
                </section>
            </div>
        )
    }
}

export default Home

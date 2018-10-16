const root = document.getElementById('root')

function Button(props) {
    return <button onClick={props.onClick}>{props.operation}</button>
}

function PostIt(props) {
    return <section>
                <article className="article">{props.postits}</article>
            </section>        
}


class App extends React.Component {
    state = { writeHere: '', postits: [] }

    keepWords = event => {
        const writeHere = event.target.value

        this.setState({ writeHere })
    }

    submit = (text) => {
        event.preventDefault()
        
        const writeHere = this.state.writeHere
        
        this.state.postits.push(writeHere)
        console.log(this.state.postits)

    }

    render() {  //aqui aparecen las cosas
        return <div>
            <h1>Post it app</h1>

            <InputForm onSubmit={this.handleSubmit} />

            <section>
                {this.state.postits.map(postit => <Post key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} />)}
            </section>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))



/* render() {  //aqui aparecen las cosas
    return <div>
        <form onSubmit={this.submit}>
        <input value={this.state.writeHere} type="text" onChange={this.keepWords}/>
        <button type="submit" onClick={this.submit}></button>
    </form>
    <div>
      {this.state.postits.map((element) => <PostIt key={element}/>)}
    </div>
    </div>
} */

import React, { Component } from 'react';
import { Button, Segment, Header,  Divider } from 'semantic-ui-react';

class BMLTResult extends Component {
  render() {
    let miles = Math.round(Math.round(this.props.numMiles));
    let milesText = miles === 1 ? `${miles} mile` : `${miles} miles`;

    let getAnswer = () => {
      if (this.props.hasBMLT) {
        return 'Yes!';
      }
      return 'No ☹';
    };

    let getContent = () => {
      if (this.props.hasBMLT) {
        return `The nearest meeting in our database is ${milesText} from you, so we think your local service body probably is using the BMLT. If you don't think this is the case, follow the links below to learn more about how to get started!`;
      }
      return `The nearest meeting in our database is ${milesText} from you, so your local service body probably is not using the BMLT.`;
    };

    let getLearnMoreText = () => {
      if (this.props.hasBMLT) {
        return 'How do I learn more about the BMLT?';
      }
      return 'I want to use the BMLT. How do I get started?';
    };

    let getRootServerComponent = () => {
      if (this.props.hasBMLT) {
        return (
          <div>
            <Divider/>
            <Segment size="mini" secondary basic>Root server: {this.props.rootServerURL}</Segment>
          </div>
        )
      }
      return <div/>;
    };

    return (
      <div>
        <Header as="h3">{getAnswer()}</Header>
        <p>{getContent()}</p>
        <Header as="h3">{getLearnMoreText()}</Header>
        <ul>
          <li>Visit the <a href="https://bmlt.magshare.net/" target="_blank" rel="noopener noreferrer">website</a>.</li>
          <li>Join our <a href="https://www.facebook.com/groups/149214049107349/" target="_blank" rel="noopener noreferrer">Facebook Group</a>.</li>
        </ul>
        <Divider hidden/>
        <Button fluid onClick={this.props.searchAgainHandler}>Search for Another Location</Button>
        {getRootServerComponent()}
      </div>
    );
  }
}

export default BMLTResult;
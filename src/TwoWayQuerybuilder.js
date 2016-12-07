var React = require('react');
var Rule = require('./Rule');
var Condition = require('./Condition');


class TwoWayQuerybuilder extends React.Component{
	constructor(props){
		super(props);
		buildDefaultConfig(props.config);
		fillDefaultButtonsText(props.buttonsText);
		console.log('default config', props.config);
		this.state = {
			data: {
				combinator: 'And',
				rules: [{field:'firstName', operator:'=', value:'Ivan'}]
			}
		}
		this.addRule = this.addRule.bind(this);
		this.addCondition = this.addCondition.bind(this);
	}

	addRule(){
		console.log('rule added');
		let data = this.state.data;
		data.rules.push({field:'lastName', operator:'=', value:'Saloed'});
		this.setState({data:data});
		console.log('state', this.state);
	}

	addCondition(){
		console.log('condition added');
		let data = this.state.data;
		data.rules.push({combinator:'AND', rules:[]});
		this.setState({data:data});
		console.log('state', this.state);		
	}

	render () {
		return <div>
			<select>
				{this.props.config.combinators.map((combinator, index)=>{
					return <option value={combinator.combinator} key={index}>{combinator.label}</option>
				})}
			</select>
			<button onClick={this.addCondition}>{this.props.buttonsText.addGroup}</button>
			<button onClick={this.addRule}>{this.props.buttonsText.addRule}</button>
			{this.state.data.rules.map((rule, index) => {
				if (rule.field) return <Rule key={index}/>
				return <Condition key={index}/>
			})}
		</div>;
	}
}

function buildDefaultConfig(config) {
	console.log('buildDefaultConfig');
	config.type = config.type ? config.type : 'SQL';
	config.query = config.query ? config.query : '()';
	config.operators = config.operators ? config.operators : 
	[
		{operator: 'IS NULL', label: 'Null'},
		{operator: 'IS NOT NULL', label: 'Not Null'},
		{operator: 'IN', label: 'In'},
		{operator: 'NOT IN', label: 'Not In'},
		{operator: '=', label: '='},
		{operator: '<>', label: '<>'},
		{operator: '<', label: '<'},
		{operator: '>', label: '>'},
		{operator: '>=', label: '>='},
		{operator: '<=', label: '<='}
	];
	config.combinators = config.combinators ? config.combinators :
	[
		{combinator:'AND', label:'And'},
		{combinator:'OR', label:'Or'},
		{combinator:'Not', label:'Not'}
	]
	config.animation = config.animation ? config.animation : 'none';
}

function fillDefaultButtonsText(buttonsText){
	buttonsText.addRule = buttonsText.addRule ? buttonsText.addRule : 'Add rule';
	buttonsText.addGroup = buttonsText.addGroup ? buttonsText.addGroup : 'Add group';
	buttonsText.clear = buttonsText.clear ? buttonsText.clear : 'Clear';
	buttonsText.delete = buttonsText.delete ? buttonsText.delete : 'Delete';
}

TwoWayQuerybuilder.propTypes = {
	config : React.PropTypes.object.isRequired,
	onChange : React.PropTypes.func.isRequired,
	buttonsText : React.PropTypes.object,
	fields : React.PropTypes.array.isRequired
}

TwoWayQuerybuilder.defaultProps = {
	buttonsText: {}
}

export default TwoWayQuerybuilder;

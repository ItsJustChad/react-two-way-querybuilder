# React Two Way Boolean Keyword Querybuilder

A simple React component that let's users build complex boolean keyword queries for text search engines (like ElasticSearch). Allows for substitution of long keyword lists on the server side. 

Biggest differences between the original and this fork: no error checking, no operators.

No 3rd party libraries.

![image](https://github.com/ItIsJustChad/react-two-way-querybuilder/blob/master/blob/builder.jpg)

## Installing

I haven't gotten this to npm yet.

## Using

Two way query builder is flexible and configurable component with a set of possible options. 

In order to use predefined terms, the values must start and end with underscores (example: _fixed_list_). It doesn't support having the keyword list load on the client side.

Simple usage:

```
    import React, { Component } from 'react';
    import TwoWayQuerybuilder from 'react-two-way-querybuilder';

    const fields = [
      { name: 'terms', label: 'Terms', input: { type: 'text' } },
      {
        name: 'predefined', label: 'Pre-Defined Terms', input: {
          type: 'select',
          options: [
            { value: '_hack_terms_', name: 'Hack Terms' },
            { value: '_outage_terms_', name: 'Outage Terms' },
          ]
        }
      },
    ];

    class App extends Component {

        handleChange(event) {
          console.log('query', event.query);
        }

        render() {
            return (
                 <TwoWayQuerybuilder fields={fields} onChange={this.handleChange} />
            );
        }
    }

    export default App;
```

###Props:

- **`fields`**: your fields used to build a query
  * name: name of the field that would be used in a query
  * label: how your field name would be shown in the dropdown
  * input: type of the input, possible options are: `text`, `textarea`, `select`. If you are using `select` input type pass options to the object in the following way:
    `input: {type: 'select', options: [{value: '1', name: 'one'}, {value: '2', name: 'two'}]}`. 
  
- **`onChange`**: pass here your function that will be called when data was changed
- **`config`**: configuration object with possible options:
  * `query`: pass here prepared query, so UI will be built using it.
   * `combinators`: array of combinators, the default one is: 
    ```
    [
        { combinator: 'AND', label: 'And' },
        { combinator: 'OR', label: 'Or' },
        { combinator: 'NOT', label: 'Not' },
    ]
    ```  
  * `style`: use this object to redefine styles. Properties:
    * `primaryBtn`: used for primary button styles,
    * `deleteBtn`: delete button styles,
    * `rule`: rule styles,
    * `condition`: condition styles,
    * `select`: select styles,
    * `input`: input styles,
    * `txtArea`: text area styles :D
    * `error`: error message styling
    
- **`buttonsText`**: text of the buttons, you can redefine it for multilanguage support or because you just want. By default used following text:
    * addRule: `'Add rule'`,
    * addGroup: `'Add group'`,
    * clear: `'Clear'`,
    * delete: `'Delete'`

## Samples

Add demo eventually. See this for rough idea:
Visit [DEMO](https://lefortov.github.io/react-two-way-querybuilder) storybook to take a look at basic usage cases: 

- **existing query**: 
  ```
    import React, { Component } from 'react';
    import TwoWayQuerybuilder from 'react-two-way-querybuilder';;

    const fields = [
      { name: 'terms', label: 'Terms', input: { type: 'text' } },
      {
        name: 'predefined', label: 'Pre-Defined Terms', input: {
          type: 'select',
          options: [
            { value: '_hack_terms_', name: 'Hack Terms' },
            { value: '_outage_terms_', name: 'Outage Terms' },
          ]
        }
      },
    ];

    const config = {
      query: "(CompanyA CompanyB AND _outage_terms_ AND ( NOT (CompanyC OR _hack_terms_)))",
    };

    class App extends Component {

        handleChange(event) {
          console.log('query', event.query);
        }

        render() {
            return (
                 <TwoWayQuerybuilder config={config} fields={fields} onChange={this.handleChange} />
            );
        }
    }

    export default App;
  ```

##License

React-two-way-quierybuidler is MIT licensed

import TreeHelper from './TreeHelper';
import ASTree from './ASTree';

export default class QueryParser {

  static parseToQuery(data, query) {
    query = '(';
    for (let i = 0, length = data.rules.length; i < length; i += 1) {
      if (!data.rules[i].combinator) {
        query += `${data.rules[i].value}`;
        if (i !== length - 1 && !data.rules[i + 1].combinator) {
          query += ` ${data.combinator} `;
        }
      } else {
        query += ` ${data.combinator} ${this.parseToQuery(data.rules[i], query)}`;
      }
    }
    return `${query})`;
  }

  static parseToData(query, config, fields) {
    const data = null;
    const tokens = this.getTokensArray(query, config.combinators);
    const asTree = ASTree.buildTree(tokens, config.combinators);
    return this.convertSyntaxTreeToData(asTree, data, config.combinators, '1', '1');
  }

  static convertSyntaxTreeToData(element, data, combinators, nodeName, combNodeName) {
    data = data ? data : {};
    let newCombName = combNodeName;
    const firstCombinator = this.getFirstCombinator(element, combinators);
    const treeHelper = new TreeHelper(data);
    const newCombinator = {
      combinator: firstCombinator ? firstCombinator.value : combinators[0].combinator,
      nodeName,
      rules: [],
    };
    let currElement = treeHelper.getNodeByName(combNodeName);
    if (element.value === '()' && !element.parent) {
      data = newCombinator;
      currElement = data;
    } else if (element.value === '()' && element.parent) {
      currElement.rules.push(newCombinator);
      newCombName = nodeName;
    } else if (element.value && element.value.field) {
      const newRule = {
        field: element.value.field,
        value: element.value.value,
        nodeName,
      };
      currElement.rules.push(newRule);
    }
    for (let i = 0; i < element.children.length; i += 1) {
      this.convertSyntaxTreeToData(element.children[i], data, combinators, `${newCombName}/${currElement.rules.length + 1}`, newCombName);
    }
    return data;
  }

  static getTokensArray(query, combinators) {
    const combinatorsIndexes = this.getCombinatorsIndexes(query, combinators);
    const tokens = [];
    let token = '';
    for (let i = 0, length = query.length; i < length; i += 1) {
      const combinatorIndexes = combinatorsIndexes.find(x => x.start === i);
      if (combinatorIndexes) {
        const combinator = query.substring(combinatorIndexes.start, combinatorIndexes.end);
        token = this.pushTokenIfNotEmpty(token, tokens);
        tokens.push(combinator);
        i = combinatorIndexes.end;
      } else if (query[i] === '(' || query[i] === ')') {
        token = this.pushTokenIfNotEmpty(token, tokens);
        tokens.push(query[i]);
      } else {
        token += query[i];
      }
    }
    return tokens;
  }

  static pushTokenIfNotEmpty(token, array) {
    token = token.trim();
    if (token) {
      array.push(this.createTokenObject(token));
    }
    return '';
  }

  static createTokenObject(token) {
    if (token.startsWith("_") && token.endsWith("_")) {
      return {
        field: "predefined",
        value: token
      }
    }
    else {
      return {
        field: "terms",
        value: token
      }
    }
  }

  static matchAll(str, regex) {
    const res = [];
    let m;
    if (regex.global) {
      while (m = regex.exec(str)) {
        res.push({ value: m[0], index: m.index });
      }
    } else if (m = regex.exec(str)) {
      res.push({ value: m[0], index: m.index });
    }
    return res;
  }

  static getCombinatorsIndexes(query, combinators) {
    const combinatorsIndexes = [];
    const combinatorsPattern = this.getSearchPattern(combinators, 'combinator');
    let match;
    while ((match = combinatorsPattern.exec(query)) !== null) {
      combinatorsIndexes.push({ start: match.index, end: combinatorsPattern.lastIndex });
    }
    return combinatorsIndexes;
  }

  static getSearchPattern(searchValues, name) {
    let pattern = '';
    for (let i = 0; i < searchValues.length; i += 1) {
      pattern += `|${searchValues[i][name]}`;
    }
    // To remove first | character
    pattern = pattern.slice(1);
    return new RegExp(pattern, 'g');
  }

  static getFirstCombinator(element, combinators) {
    let foundCombinator = element.children.find(x => combinators.find(y => y.combinator === x.value));
    if (!foundCombinator) {
      for (let i = 0; i < element.children.length; i += 1) {
        foundCombinator = this.getFirstCombinator(element.children[i], combinators);
      }
    }
    return foundCombinator;
  }
}

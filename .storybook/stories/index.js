import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TwoWayQuerybuilder from '../../src/TwoWayQuerybuilder';
import './index.css';

const config = {
  query: "(CompanyA CompanyB AND _outage_terms_ AND ( NOT (CompanyC OR _hack_terms_)))",
};

const defaultFields = [
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

const styles = {
  primaryBtn: 'customPrimaryBtn',
  deleteBtn: 'customDeleteBtn',
  rule: 'rule',
  condition: 'condition',
  select: 'querySelect',
  input: 'queryInput',
  txtArea: 'queryText',
};

const changedStyles = {
  styles,
};

storiesOf('Query builder', module)
  .add('default view', () => (
    <TwoWayQuerybuilder fields={defaultFields} onChange={action('data changed')} />
  ))
  .add('existing query', () => (
    <TwoWayQuerybuilder config={config} fields={defaultFields} onChange={action('data changed')} />
  ))
  .add('custom styles', () => (
    <TwoWayQuerybuilder config={changedStyles} fields={defaultFields} onChange={action('data changed')} />
  ));

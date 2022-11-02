# place-details



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                                                   | Default     |
| -------- | --------- | ----------- | -------------------------------------------------------------------------------------- | ----------- |
| `pageId` | `pageid`  |             | `string`                                                                               | `undefined` |
| `place`  | --        |             | `{ PlaceProps: Place; PageText: string; Wikipedia: WikipediaData; imageUrl: string; }` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `detailClose` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [local-places](../local-places)

### Graph
```mermaid
graph TD;
  local-places --> place-details
  style place-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

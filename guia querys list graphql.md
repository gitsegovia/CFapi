//ACTION FOREIGN KEY
The possible choices are RESTRICT, CASCADE, NO ACTION, SET DEFAULT and SET NULL.

The defaults for the One-To-One associations is SET NULL for ON DELETE and CASCADE for ON UPDATE.

characters(page: 0, filter: {
species: "robot"
}) {
info {
count
pages
next
prev
**typename
}
results {
id
name
species
**typename
}
}

para mejorar el graphql hacer que toda query de listas sea del tipo
[tipoResultados]

tipoResultados {
info: Info
result: [TipoResultado]
}

type Info {
count: Int
The length of the response.
pages: Int
The amount of pages.
next: Int
Number of the next page (if it exists)
prev: Int
Number of the previous page (if it exists)
}

las querys con los parametros (page, filter)
page: Int
filter: FilterTipoResultado

// DEFINIDO DENTRO DEl PROYECTO

type TypeCompanyResult {
infoPage: InfoPage
results: [TypeCompany!]
}

type Query {
getListAllTypeCompany(search: SearchTypeCompanyInput): TypeCompanyResult
}

input SearchTypeCompanyInput {
options: OptionsSearch
}

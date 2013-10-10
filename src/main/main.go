/*
 *
 */

package main

import (
    "fmt"
    "search"
)






func main() {
    fmt.Println("Server started")
    search.Server("127.0.0.1:9101")
    fmt.Println("Server exit")
}

var xmlDoc;

function loadDoc(url, funct) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            funct(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function loadBooks(xml) {
    xmlDoc = xml.responseXML;
    var table="<tr><th>Index</th><th>Title</th><th>Artist</th></tr>";
    var x = xmlDoc.getElementsByTagName("book");
    for (var i = 0; i <x.length; i++) {
        var title = x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        var author = x[i].getElementsByTagName("author")[0].childNodes[0].nodeValue;
        table += "<tr data-index='" + i + "'><td>" + (i+1) + "</td><td>" + title + "</td><td>" + author + "</td></tr>";
    }
    document.getElementById("bookshelf").innerHTML = table;

    var rows = document.querySelectorAll("#bookshelf tr");
    rows.forEach(function(row) {
        row.addEventListener("click", function(){
            var index = this.getAttribute("data-index");
            showBookDetails(index, x[index]);
        });
    });
}

function showBookDetails(index, bookNode) {
    var title = bookNode.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    var author = bookNode.getElementsByTagName("author")[0].childNodes[0].nodeValue;
    var year = bookNode.getElementsByTagName("year")[0].childNodes[0].nodeValue;
    var price = bookNode.getElementsByTagName("price")[0].childNodes[0].nodeValue;
    var category = bookNode.getAttribute("category");

    var details = "<b>Title:</b> " + title + "<br><b>Category:</b> " + category + "<br><b>Author:</b> " + author + "<br><b>Year:</b> " + year + "<br><b>Price:</b> " + price +"$<br><span id='deleteBook' data-bookIndex='" + index + "'>Usun</span>";
    document.getElementById("bookDetails").innerHTML = details;

    var deleteButton = document.getElementById("deleteBook");
    deleteButton.addEventListener("click", function(){
        deleteBook(index);
    });
}

function deleteBook(index) {
    var x = xmlDoc.getElementsByTagName("book")[index];
    console.log(xmlDoc);
    
    try {
        x.parentNode.removeChild(x);
        document.getElementById("bookDetails").innerHTML = "Deleted book";
    } catch (error) {  
        console.error('Wystąpił błąd podczas usuwania:', error);
    }
    console.log(xmlDoc);

    try {
        localStorage.setItem('modifiedXML', new XMLSerializer().serializeToString(xmlDoc));
        console.log('Zmodyfikowany XML został zapisany w lokalnym magazynie.');
    } catch (error) {
        console.error('Wystąpił błąd podczas zapisywania zmodyfikowanego XML do lokalnego magazynu:', error);
    }
    loadBooks({responseXML: xmlDoc});
}

function addNewBook() {
    event.preventDefault();
    var form = document.getElementById("bookForm");

    // Tworzenie nowego węzła "book"
    var newNode = xmlDoc.createElement("book");

    // Tworzenie nowych węzłów dla danych książki
    var newNodeTitle = xmlDoc.createElement("title");
    var newNodeAuthor = xmlDoc.createElement("author");
    var newNodeYear = xmlDoc.createElement("year");
    var newNodePrice = xmlDoc.createElement("price");

    // Ustawienie wartości tekstowych dla nowych węzłów
    newNodeTitle.appendChild(xmlDoc.createTextNode(form.elements["title"].value));
    newNodeAuthor.appendChild(xmlDoc.createTextNode(form.elements["author"].value));
    newNodeYear.appendChild(xmlDoc.createTextNode(form.elements["year"].value));
    newNodePrice.appendChild(xmlDoc.createTextNode(form.elements["price"].value));

    // Ustawienie atrybutu "category" dla węzła "title"
    newNodeTitle.setAttribute("category", form.elements["category"].value);

    // Dodanie nowych węzłów do węzła "book"
    newNode.appendChild(newNodeTitle);
    newNode.appendChild(newNodeAuthor);
    newNode.appendChild(newNodeYear);
    newNode.appendChild(newNodePrice);

    // Dodanie nowego węzła "book" do dokumentu XML
    xmlDoc.getElementsByTagName("bookshelf")[0].appendChild(newNode);

    // Zapisanie zmodyfikowanego XML do local storage
    try {
        localStorage.setItem('modifiedXML', new XMLSerializer().serializeToString(xmlDoc));
        console.log('Zmodyfikowany XML został zapisany w lokalnym magazynie.');
    } catch (error) {
        console.error('Wystąpił błąd podczas zapisywania zmodyfikowanego XML do lokalnego magazynu:', error);
    }

    // Ponowne załadowanie książek
    loadBooks({responseXML: xmlDoc});
    return false;
}
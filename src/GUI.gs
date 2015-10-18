
function populateProductData(fields, products) {

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var first = ss.getSheetByName("Sheet1");
    var sheetReference = ss.getSheetByName("Sheet1.reference");

    first.clear();
    first.clearContents();
    first.clearNotes();

    sheetReference.clear();
    sheetReference.clearContents();



    var cell = first.getRange('a1');
    var index = 0;
    var col = 0;

    for (var j in fields) {
        cell.offset(index, col).setValue(j);
        col++;
    }



    var cell = first.getRange('a2');
    var index = 0;
    for (var i in products) {
        var product = products[i];
        var col = 0;


        for (var j in fields) {

            if (product[j]) {
                cell.offset(index, col).setValue(product[j]);

            } else {
                cell.offset(index, col).setValue('');
            }
            col++;

        }


        /*
         for (var j in row) {

         if (fields[j]) {
         cell.offset(index, col).setValue(row[j]);
         col++;
         } else {
         //cell.offset(index, col).setValue('');
         }

         }
         */



        index++;
    }


    first.getRange(1, 1, first.getLastRow(), first.getLastColumn()).copyTo(sheetReference.getRange("A1"), {contentsOnly:true});


    first.getRange(1, 1, 1, first.getLastColumn()).setFontWeight('bold');
    first.getActiveRange().setHorizontalAlignment('top');
    first.getActiveRange().setWrap(true);

    return products;
}


function onEditEventCheck(e) {
    Logger.log(e);
    var range = e.range;
    var newValue = e.value;

    var referenceValue = 33;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetReference = ss.getSheetByName("Sheet1.reference");

    var rangeA1Notation = e.range.getA1Notation();
    Logger.log('rangeA1Notation:%s', rangeA1Notation);

    referenceValue = sheetReference.getRange(rangeA1Notation).getValues();

    Logger.log(newValue);

    Logger.log(referenceValue);


    if (newValue != referenceValue) {
        range.setNote(referenceValue);
        range.setBackground("red");
        return;
    }

    range.setNote();
}

function getChangedProducts() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Sheet1');

    var range = sheet.getDataRange();
    var values = range.getValues();


    var notes = range.getNotes();

    var changes = [];
    var change = {};

    var entity_id = null;
    var cellValue = null;
    var noteValue = null;

    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
    header = header[0];

    for (var row in notes) {
        entity_id = null;
        change = {};

        for (var column in notes[row]) {
            noteValue = notes[row][column];

            if (!noteValue) {
                continue;
            }

            row = parseInt(row);
            column = parseInt(column);

            if (!change['entity_id']) {

                entity_id = sheet.getRange(row + 1, 1).getValue();
                entity_id = '' + parseInt(entity_id);
                Logger.log("%s:%s - %s", row + 1, 1, entity_id);
                change['entity_id'] = entity_id;
            }

            cellValue = sheet.getRange(row + 1, column + 1).getValue();
            change[header[column]] = cellValue;

        }

        if (change['entity_id']) {
            changes.push(change);
        }
    }

    Logger.log(changes);

    return changes;
}

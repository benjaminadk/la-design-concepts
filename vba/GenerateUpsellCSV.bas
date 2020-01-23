Attribute VB_Name = "Module1"
Sub GenerateUpsellCSV()
'
' Generate Upsells Macro
'
'
' Assumes items are sorted by base sku
' Requires column of base skus and column of regular skus - headers labeled

' Find out how many rows are used and save as variable

   lastrow = ActiveSheet.UsedRange.Rows.Count
    
' Insert formulas across the first row of data

' 1 - Look for base sku matches and combine skus to build list

    Range("C2").Select
    ActiveCell.FormulaR1C1 = "=IF(R[-1]C[-2]=RC[-2],RC[-1]&""|""&R[-1]C,RC[-1])"

' 2 - Find the last occurance of a base sku where full list is built and apply to all matching base skus
    
    Range("D2").Select
    ActiveCell.FormulaR1C1 = _
        "=INDEX(C[-3]:C[-1],MATCH(RC[-3],C[-3],0)+(COUNTIF(C[-3],RC[-3])-1),3)"

' 3 - Remove a products sku from its list of upsells - products dont reference themselves
    
    Range("E2").Select
    ActiveCell.FormulaR1C1 = "=SUBSTITUTE(RC[-1],RC[-3],"""")"

' 4 - Remove leading "|" characters
    
    Range("F2").Select
    ActiveCell.FormulaR1C1 = _
        "=IF(LEFT(RC[-1],1)=""|"",RIGHT(RC[-1],LEN(RC[-1])-1),RC[-1])"

' 5 - Remove trailing "|" characters
    
    Range("G2").Select
    ActiveCell.FormulaR1C1 = _
        "=IF(RIGHT(RC[-1],1)=""|"",LEFT(RC[-1],LEN(RC[-1])-1),RC[-1])"

' 6 - Remove any "||" and replace with "|"
    
    Range("H2").Select
    ActiveCell.FormulaR1C1 = "=SUBSTITUTE(RC[-1],""||"",""|"")"
    
' Copy formulas down each column of data - uses lastrow to handle any amount of data

    Range("C2").Select
    Selection.AutoFill Destination:=Range("C2:C" & lastrow)

    Range("D2").Select
    Selection.AutoFill Destination:=Range("D2:D" & lastrow)

    Range("E2").Select
    Selection.AutoFill Destination:=Range("E2:E" & lastrow)

    Range("F2").Select
    Selection.AutoFill Destination:=Range("F2:F" & lastrow)

    Range("G2").Select
    Selection.AutoFill Destination:=Range("G2:G" & lastrow)

    Range("H2").Select
    Selection.AutoFill Destination:=Range("H2:H" & lastrow)

' Copy entire upsells column and paste into new sheet

    Columns("H:H").Select
    Selection.Copy
    Sheets("upsells").Select
    Columns("B:B").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False

' Copy entire sku column and paste into new sheet

    Sheets("base_sku").Select
    Columns("B:B").Select
    Application.CutCopyMode = False
    Selection.Copy
    Sheets("upsells").Select
    Columns("A:A").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
        
' Label column headers in new sheet

    Range("B1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "upsell_skus"
    Range("A1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "sku"

' Delete any row with no upsells
    removeBlankRows

' Saving Options
' -----------------------------------------------------------------------------------------------------------------------------

' Simple Save - Prompt user for name and save to Downloads folder

' 1 - Prompt user for filename

    Dim filename As Variant
    filename = InputBox("Enter the name for your new CSV file", "File will be saved in Downloads Folder as a CSV")
    
' 2 - Check User input

    If filename = "" Then
        filename = RandomString(5)
    End If
    
' 3 - Save sheet as new csv file
    
    Worksheets("upsells").Copy
    With ActiveWorkbook
        .SaveAs filename:="C:\Users\Benjamin\Downloads\" & filename & ".csv", FileFormat:=xlCSV
        .Close SaveChanges:=False
    End With
    
' Complex Save - Use native SaveAs Dialog
' Application.FileDialog(msoFileDialogSaveAs)
  
' ----------------------------------------------------------------------------------------------------------------------------------
    
'  Clear data for a fresh start next time

    Sheets("upsells").UsedRange.ClearContents
    Sheets("base_sku").UsedRange.ClearContents

'  Relabel headers on base_sku sheet

    Sheets("base_sku").Select
    Range("B1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "sku"
    Range("A1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "base"
End Sub





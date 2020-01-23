Attribute VB_Name = "Module1"
Sub GenerateLadcContent()
Attribute GenerateLadcContent.VB_ProcData.VB_Invoke_Func = " \n14"
'
' Macro3 Macro
'

' Find last row used
    
    lastrow = ActiveSheet.UsedRange.Rows.Count

' Properly format content types

    Range("C2").Select
    ActiveCell.FormulaR1C1 = "=PROPER(RC[-1])"
    Range("C2").Select
    Selection.AutoFill Destination:=Range("C2:C" & lastrow)

' Copy and Paste formatted values

    Range("C2").Select
    Range(Selection, Selection.End(xlDown)).Select
    Selection.Copy
    ActiveWindow.SmallScroll Down:=-100
    Range("D2").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
    Application.CutCopyMode = False
    
' Use text to column to split text on commas

    Selection.TextToColumns Destination:=Range("D2"), DataType:=xlDelimited, _
        TextQualifier:=xlDoubleQuote, ConsecutiveDelimiter:=False, Tab:=False, _
        Semicolon:=False, Comma:=True, Space:=False, Other:=False, FieldInfo _
        :=Array(Array(1, 1), Array(2, 1), Array(3, 1), Array(4, 1)), TrailingMinusNumbers:= _
        True
    
' Allow 6 columns for the 6 potential content types
' Remove "%" value and trim white space
' This creates 6 new columns of formatted individual content names

    Range("J2").Select
    ActiveCell.FormulaR1C1 = _
        "=IF(RC[-6]="""","""",TRIM(RIGHT(RC[-6],LEN(RC[-6])-FIND(""%"",RC[-6])-1)))"
    Range("J2").Select
    Selection.AutoFill Destination:=Range("J2:O2"), Type:=xlFillDefault
    Range("J2:O2").Select
    Selection.AutoFill Destination:=Range("J2:O" & lastrow), Type:=xlFillDefault

' Combine contents that are on our dropdown list

    Range("P2").Select
    ActiveCell.FormulaR1C1 = _
        "=IF(AND(RC[-6]<>"""",ISNUMBER(MATCH(RC[-6],fabrics!R1C1:R16C1,0))),RC[-6]&""|"","""")&IF(AND(RC[-5]<>"""",ISNUMBER(MATCH(RC[-5],fabrics!R1C1:R16C1,0))),RC[-5]&""|"","""")&IF(AND(RC[-4]<>"""",ISNUMBER(MATCH(RC[-4],fabrics!R1C1:R16C1,0))),RC[-4]&""|"","""")&IF(AND(RC[-3]<>"""",ISNUMBER(MATCH(RC[-3],fabrics!R1C1:R16C1,0))),RC[-3]&""|"","""")&IF(AND(RC[-2]<>"""",ISNUMBER(MA" & _
        "TCH(RC[-2],fabrics!R1C1:R16C1,0))),RC[-2]&""|"","""")&IF(AND(RC[-1]<>"""",ISNUMBER(MATCH(RC[-1],fabrics!R1C1:R16C1,0))),RC[-1]&""|"","""")" & _
        ""
    Range("P2").Select
    Selection.AutoFill Destination:=Range("P2:P" & lastrow)

' Remove the trailing "|" character where it exists

    Range("Q2").Select
    ActiveCell.FormulaR1C1 = "=IF(RC[-1]="""","""",LEFT(RC[-1],LEN(RC[-1])-1))"
    Range("Q2").Select
    Selection.AutoFill Destination:=Range("Q2:Q" & lastrow)
    
' Copy sku and ladc content value into a new sheet

    Range("Q2:Q" & lastrow).Select
    Selection.Copy
    Sheets("output").Select
    Range("B2").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
    Sheets("input").Select
    Range("A2").Select
    Application.CutCopyMode = False
    Range(Selection, Selection.End(xlDown)).Select
    Selection.Copy
    Sheets("output").Select
    Range("A2").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
        
' Label column headers on new sheet

    Range("A1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "sku"
    Range("B1").Select
    ActiveCell.FormulaR1C1 = "ladc_content"
    
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
    
    Worksheets("output").Copy
    With ActiveWorkbook
        .SaveAs filename:="C:\Users\IT\Downloads\" & filename & ".csv", FileFormat:=xlCSV
        .Close SaveChanges:=False
    End With
    
' Complex Save - Use native SaveAs Dialog
' Application.FileDialog(msoFileDialogSaveAs)
  
' ----------------------------------------------------------------------------------------------------------------------------------
    
'  Clear data for a fresh start next time

    Sheets("output").UsedRange.ClearContents
    Sheets("input").UsedRange.ClearContents

'  Relabel headers on base_sku sheet

    Sheets("input").Select
    Range("B1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "content"
    Range("A1").Select
    Application.CutCopyMode = False
    ActiveCell.FormulaR1C1 = "sku"

End Sub

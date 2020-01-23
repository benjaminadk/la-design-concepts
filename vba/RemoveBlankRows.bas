Attribute VB_Name = "Module4"
Sub removeBlankRows()
 Dim MyRange As Range
 Dim lngLastRow As Long
    Set MyRange = Range("A:B") ' grab the range
    lngLastRow = Cells(Rows.Count, MyRange.Column).End(xlUp).Row  ' grab the last value, swap it for 2500
    Dim i As Integer
    For i = lngLastRow To 1 Step -1 ' loop through, starting at the last column
        If Range("B" & i).Value = "" Then ' test if there is not a value
            Rows(i).EntireRow.Delete   'delete!
        End If
    Next i
End Sub

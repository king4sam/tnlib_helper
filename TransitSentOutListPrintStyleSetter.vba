Sub 列印()
'
' 列印 Macro
'
    
' delete
    Rows("1:6").Select
    Selection.Delete Shift:=xlUp
    
    Range("A:A,C:C,D:D,E:E,H:H,I:I,K:K,L:L,M:M").Select
    Selection.Delete Shift:=xlToLeft
    
    Dim lRowCount As Long
    
    Application.ActiveSheet.UsedRange
    lRowCount = Worksheets("_usr_local_tomcat_webapps_torea").UsedRange.Rows.Count
    'MsgBox (lRowCount)
    
' title
    Range("F1").Select
    ActiveCell.FormulaR1C1 = "=LEFTB(RC[-5],30)"
    Selection.AutoFill Destination:=Range("F1:F" & CStr(lRowCount)), Type:=xlFillDefault
    'MsgBox ("E1:E" & CStr(lRowCount))
    Range("F1:F" & CStr(lRowCount)).Select
    
    Range("G1").Select
    ActiveCell.FormulaR1C1 = "=LEFTB(RC[-5],10)"
    Selection.AutoFill Destination:=Range("G1:G" & CStr(lRowCount)), Type:=xlFillDefault
    Range("G1:G" & CStr(lRowCount)).Select
    
    Range("H1").Select
    ActiveCell.FormulaR1C1 = "=LEFTB(RC[-5],10)"
    Selection.AutoFill Destination:=Range("H1:H" & CStr(lRowCount)), Type:=xlFillDefault
    Range("H1:H" & CStr(lRowCount)).Select
    
    Range("I1").Select
    ActiveCell.FormulaR1C1 = "=LEFTB(RC[-5],30)"
    Selection.AutoFill Destination:=Range("I1:I" & CStr(lRowCount)), Type:=xlFillDefault
    Range("I1:I" & CStr(lRowCount)).Select
    
    Range("J1").Select
    ActiveCell.FormulaR1C1 = "=LEFTB(RC[-5],8)"
    Selection.AutoFill Destination:=Range("J1:J" & CStr(lRowCount)), Type:=xlFillDefault
    Range("J1:J" & CStr(lRowCount)).Select

'cp
    Range("F1:J" & CStr(lRowCount)).Select
    Selection.Copy

    Range("K1").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
    
    Columns("A:J").Select
    Selection.Delete Shift:=xlToLeft

'sort
    Range("D1:D" & CStr(lRowCount)).Select
    ActiveWorkbook.Worksheets("_usr_local_tomcat_webapps_torea").Sort.SortFields. _
        Clear
    ActiveWorkbook.Worksheets("_usr_local_tomcat_webapps_torea").Sort.SortFields. _
        Add Key:=Range("D1"), SortOn:=xlSortOnValues, Order:=xlAscending, _
        DataOption:=xlSortNormal
    With ActiveWorkbook.Worksheets("_usr_local_tomcat_webapps_torea").Sort
        .SetRange Range("A1:E" & CStr(lRowCount))
        .Header = xlNo
        .MatchCase = False
        .Orientation = xlTopToBottom
        .SortMethod = xlPinYin
        .Apply
    End With

'resize
    Columns("A:A").ColumnWidth = 30
    Columns("B:B").ColumnWidth = 10
    Columns("C:C").ColumnWidth = 11
    Columns("D:D").ColumnWidth = 16.5
    Columns("E:E").ColumnWidth = 8
    
'border
    Range("A1:E" & CStr(lRowCount)).Select
    Range("E" & CStr(lRowCount)).Activate
    Selection.Borders(xlDiagonalDown).LineStyle = xlNone
    Selection.Borders(xlDiagonalUp).LineStyle = xlNone
    With Selection.Borders(xlEdgeLeft)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeTop)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeBottom)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlEdgeRight)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlInsideVertical)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With
    With Selection.Borders(xlInsideHorizontal)
        .LineStyle = xlContinuous
        .ColorIndex = 0
        .TintAndShade = 0
        .Weight = xlThin
    End With

End Sub

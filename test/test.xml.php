<?php
header('Content-Type: text/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <soap:Body>
    <res:Response
      xmlns:res="http://www.ebasetech.com/LADRA_COPYMOVE_TERM_OP/Response"
    >
      <res:OUTPUT>
        <res:UNDO_COUNT>1.0</res:UNDO_COUNT>
        <res:MSG>Undo complete (No more to undo)</res:MSG>
      </res:OUTPUT>
    </res:Response>
    <res:OUTPUT
      xmlns:res="http://www.ebasetech.com/LADRA_COPYMOVE_TERM_OP/Response"
    >foo</res:OUTPUT>
  </soap:Body>
  <foo xmlns="bar">
    <baz/>
  </foo>
  <bla/>
</soap:Envelope>

<?php

/****************************************************************************************
* LiveZilla objects.mail.inc.php
* 
* Copyright 2014 LiveZilla GmbH
* All rights reserved.
* LiveZilla is a registered trademark.
* 
* Improper changes to this file may cause critical errors.
***************************************************************************************/ 

if(!defined("IN_LIVEZILLA"))
	die();

class MailSystem
{
    private $Account;
    private $Receiver;
    private $ReplyTo;
    private $MailText;
    private $Subject;
    private $TestIt;
    private $Attachments;
    private $FakeSender;

    public $Result = "";
    
    function MailSystem($_account,$_receiver,$_replyto,$_text,$_subject="",$_test=false,$_attachments=null)
    {
        $this->Account = $_account;
        $this->Receiver = $_receiver;
        $this->ReplyTo = $_replyto;
        $this->MailText = $_text;
        $this->Subject = $_subject;
        $this->TestIt = $_test;
        $this->Attachments = $_attachments;
    }

    function SendEmail($_fakeSender="")
    {
        if($this->Account == null)
           $this->Account=Mailbox::GetDefaultOutgoing();
    
        if($this->Account == null)
            return null;

        $this->FakeSender = $_fakeSender;
    
        if($this->Account->Type == "SMTP")
        {
            if($this->Account->Framework=="PHP_MAILER")
                return false;
            else
                $this->Result = $this->SEND_SMTP_ZEND();
        }
        else if($this->Account->Type == "PHPMail")
        {
            $this->Result = $this->SEND_PHP_MAIL($this->Receiver);
        }
    }

    private function SEND_SMTP_ZEND()
    {
        try
        {
            loadLibrary("ZEND","Zend_Mail");
            loadLibrary("ZEND","Zend_Mail_Transport_Smtp");
    
            if(empty($this->MailText))
                $this->MailText = ">>";

            if($this->Account->Authentication=="No")
                $config = array('port' => $this->Account->Port);
            else
                $config = array('auth' => 'login', 'username' => $this->Account->Username,'password' => $this->Account->Password, 'port' => $this->Account->Port);

            if(!empty($this->Account->SSL))
                $config['ssl'] = ($this->Account->SSL==1) ? 'SSL' : 'TLS';

            $transport = new Zend_Mail_Transport_Smtp($this->Account->Host, $config);

            $mail = new Zend_Mail('UTF-8');
            $mail->setBodyText($this->MailText);

            if(empty($this->FakeSender))
                $mail->setFrom($this->Account->Email, $this->Account->SenderName);
            else
                $mail->setFrom($this->FakeSender, $this->FakeSender);
    
            if(strpos($this->Receiver,",") !== false)
            {
                $emails = explode(",",$this->Receiver);
                $add = false;
                foreach($emails as $mailrec)
                    if(!empty($mailrec))
                        if(!$add)
                        {
                            $add = true;
                            $mail->addTo($mailrec, $mailrec);
                        }
                        else
                        {
                            $mail->addBcc($mailrec, $mailrec);
                        }
            }
            else
                $mail->addTo($this->Receiver, $this->Receiver);
    
            $mail->setSubject($this->Subject);
            $mail->setReplyTo($this->ReplyTo, $name=null);

            if($this->Attachments != null)
                foreach($this->Attachments as $resId)
                {
                    $res = getResource($resId);
                    $at = $mail->createAttachment(file_get_contents("./uploads/" . $res["value"]));
                    $at->type        = 'application/octet-stream';
                    $at->disposition = Zend_Mime::DISPOSITION_ATTACHMENT;
                    $at->encoding    = Zend_Mime::ENCODING_BASE64;
                    $at->filename    = $res["title"];
                }
            $mail->send($transport);
        }
        catch (Exception $e)
        {
            if($this->TestIt)
                throw $e;
            else
                handleError("111",$this->Account->Host . " send mail connection error: " . $e->getMessage(),"functions.global.inc.php",0);
            return 0;
        }
        return 1;
    }

    private function SEND_PHP_MAIL($_receiver="", $result = "")
    {
        if(strpos($_receiver,",") !== false)
        {
            $emails = explode(",",$_receiver);
            foreach($emails as $mail)
                if(!empty($mail))
                    $result = $this->SEND_PHP_MAIL(trim($mail), $result);
            return $result;
        }

        $mailtext = $this->MailText;
        $ehash = md5(date('r', time()));
        $EOL = "\r\n";

        if(empty($this->FakeSender))
            $headers  = "From: ".$this->Account->Email.$EOL;
        else
            $headers  = "From: ".$this->FakeSender.$EOL;

        $headers .= "Reply-To: ".$this->ReplyTo.$EOL;
        $headers .= "Date: ".date("r").$EOL;
        $headers .= "MIME-Version: 1.0".$EOL;
        $headers .= "X-Mailer: LiveZilla.net/" . VERSION.$EOL;

        if($this->Attachments != null)
        {
            $headers .= "Content-Type: multipart/mixed; boundary=\"".$ehash."\"".$EOL.$EOL;
            $headers .= "--".$ehash.$EOL;
            $headers .= "Content-Type: text/plain; charset=UTF-8; format=flowed".$EOL;
            $headers .= "Content-Transfer-Encoding: 8bit".$EOL.$EOL;
            $headers .= $mailtext.$EOL.$EOL;
            $headers .= "--".$ehash.$EOL;
            foreach($this->Attachments as $resId)
            {
                $res = getResource($resId);
                if($res==null)
                    continue;
                $content = chunk_split(base64_encode(file_get_contents("./uploads/" . $res["value"])));
                $headers .= "Content-Type: application/octet-stream; name=\"".$res["title"]."\"".$EOL;
                $headers .= "Content-Transfer-Encoding: base64".$EOL;
                $headers .= "Content-Disposition: attachment; filename=\"".$res["title"]."\"".$EOL.$EOL;
                $headers .= $content.$EOL.$EOL;
                $headers .= "--".$ehash.$EOL;
            }
            $mailtext="";
            $headers .= "--".$ehash."--".$EOL;
        }
        else
        {
            $headers .= "Content-Type: text/plain; charset=UTF-8; format=flowed".$EOL;
            $headers .= "Content-Transfer-Encoding: 8bit".$EOL.$EOL;
        }

        if(@mail($_receiver, $this->Subject, $mailtext, $headers))
            return 1;
        else
            return "The email could not be sent using PHP mail(). Please try another Return Email Address or use SMTP.";
    }
}


?>

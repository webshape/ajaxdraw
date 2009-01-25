#!/usr/bin/perl

use strict;
use warnings;

use CGI qw( :standard );
use File::Temp qw( tempfile );

print header({-type => 'text/plain'});

my $content = param('what');
my ($fh, $fname) = tempfile('/tmp/tmpXXXXXX');

if ($fh) {
    print $fh $content;
    print "/cgi-bin/get.pl?name=$fname";
    close $fh;
} else {
    print "Error: $!";
}
